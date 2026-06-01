import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import {
  deriveAlertSnapshot,
  deriveGlobalStatus,
  evaluateAlertRules,
  findAddedOrEscalatedAlertTypes,
  isGlobalStatusEscalation,
  type AlertRuleResult,
  type AlertSeverity,
  type AlertType,
} from '../../../src/lib/alertRules.ts';
import {
  recordEvaluationPersistenceResult,
  recordSubscriptionUpdateResult,
} from '../../../src/lib/weatherAlertPersistence.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';
const CRON_SECRET = Deno.env.get('WEATHER_ALERT_CRON_SECRET') ?? '';

const JOB_NAME = 'weather-alert-cron';
const BATCH_SIZE = Number(Deno.env.get('WEATHER_ALERT_BATCH_SIZE') ?? '100');
const MAX_EXECUTION_MS = Number(Deno.env.get('WEATHER_ALERT_MAX_EXECUTION_MS') ?? '50000');
const LOCK_TTL_MS = Number(Deno.env.get('WEATHER_ALERT_LOCK_TTL_MS') ?? '120000');
const WEATHER_FETCH_TIMEOUT_MS = Number(Deno.env.get('WEATHER_ALERT_FETCH_TIMEOUT_MS') ?? '8000');

const COOLDOWN_MS: Record<string, number> = {
  frost: 6 * 60 * 60 * 1000,
  heat: 6 * 60 * 60 * 1000,
  uv: 6 * 60 * 60 * 1000,
  wind: 3 * 60 * 60 * 1000,
  windGust: 3 * 60 * 60 * 1000,
  precipitation: 8 * 60 * 60 * 1000,
  dewPoint: 12 * 60 * 60 * 1000,
};

type Subscription = {
  id: string;
  chat_id: string;
  latitude: number;
  longitude: number;
  timezone: string;
  thresholds: { wind: number; maxTemp: number; minTemp: number; uv: number; rain: number };
  last_status: 'normal' | 'warning' | 'danger' | null;
  last_sent_at: Record<string, string> | null;
  last_alert_snapshot: Partial<Record<AlertType, AlertSeverity>> | null;
};

type RunMetrics = {
  startedAt: Date;
  finishedAt?: Date;
  durationMs: number;
  subscriptionsProcessed: number;
  notificationsSent: number;
  errorsCount: number;
  timedOut: boolean;
  lockAcquired: boolean;
};

async function fetchWeather(latitude: number, longitude: number, timezone: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,uv_index,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,wind_gusts_10m,precipitation_probability&daily=precipitation_sum&timezone=${timezone}&forecast_days=2`;
  const res = await fetch(url, { signal: AbortSignal.timeout(WEATHER_FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error('Open-Meteo request failed');
  return res.json();
}

function shouldNotify(type: string, sentAtMap: Record<string, string> | null): boolean {
  if (!sentAtMap?.[type]) return true;
  const lastSent = new Date(sentAtMap[type]).getTime();
  return Date.now() - lastSent >= (COOLDOWN_MS[type] ?? 6 * 60 * 60 * 1000);
}

function shouldNotifyTypesWithCooldown(
  types: AlertType[],
  sentAtMap: Record<string, string> | null,
): AlertType[] {
  return types.filter((type) => shouldNotify(type, sentAtMap));
}

async function sendTelegram(chatId: string, alerts: AlertRuleResult[]) {
  if (!TELEGRAM_BOT_TOKEN || alerts.length === 0) return false;
  const text = ['🚨 <b>Alertas de Magec Grow</b>']
    .concat(alerts.map((a) => `${a.icon} <b>${a.type}</b>: ${a.message}`))
    .join('\n');

  const res = await fetch(`${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  return res.ok;
}

async function acquireLock(lockToken: string): Promise<boolean> {
  const nowIso = new Date().toISOString();
  const lockUntilIso = new Date(Date.now() + LOCK_TTL_MS).toISOString();

  const { data, error } = await supabase
    .from('weather_alert_cron_control')
    .update({
      lock_token: lockToken,
      locked_until: lockUntilIso,
      updated_at: nowIso,
    })
    .eq('job_name', JOB_NAME)
    .or(`locked_until.is.null,locked_until.lt.${nowIso}`)
    .select('job_name')
    .maybeSingle();

  if (error) {
    console.error('Failed to acquire lock', error);
    return false;
  }

  return Boolean(data);
}

async function releaseLock(lockToken: string) {
  const { error } = await supabase
    .from('weather_alert_cron_control')
    .update({
      lock_token: null,
      locked_until: null,
      updated_at: new Date().toISOString(),
    })
    .eq('job_name', JOB_NAME)
    .eq('lock_token', lockToken);

  if (error) {
    console.error('Failed to release lock', error);
  }
}

async function persistRunMetrics(metrics: RunMetrics) {
  const { error } = await supabase
    .from('weather_alert_cron_runs')
    .insert({
      job_name: JOB_NAME,
      started_at: metrics.startedAt.toISOString(),
      finished_at: (metrics.finishedAt ?? new Date()).toISOString(),
      duration_ms: metrics.durationMs,
      subscriptions_processed: metrics.subscriptionsProcessed,
      notifications_sent: metrics.notificationsSent,
      errors_count: metrics.errorsCount,
      timed_out: metrics.timedOut,
      metadata: {
        batch_size: BATCH_SIZE,
        max_execution_ms: MAX_EXECUTION_MS,
        lock_acquired: metrics.lockAcquired,
      },
    });

  if (error) {
    console.error('Failed to persist cron metrics', error);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const requestSecret = req.headers.get('x-cron-secret') ?? '';
  if (!CRON_SECRET || requestSecret !== CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const metrics: RunMetrics = {
    startedAt: new Date(),
    durationMs: 0,
    subscriptionsProcessed: 0,
    notificationsSent: 0,
    errorsCount: 0,
    timedOut: false,
    lockAcquired: false,
  };

  const lockToken = crypto.randomUUID();

  try {
    metrics.lockAcquired = await acquireLock(lockToken);

    if (!metrics.lockAcquired) {
      metrics.finishedAt = new Date();
      metrics.durationMs = metrics.finishedAt.getTime() - metrics.startedAt.getTime();
      await persistRunMetrics(metrics);
      return new Response(JSON.stringify({ ok: true, skipped: 'already_running' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: subscriptions, error } = await supabase
      .from('weather_alert_subscriptions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);

    if (error) {
      metrics.errorsCount += 1;
      return new Response(error.message, { status: 500 });
    }

    for (const sub of (subscriptions ?? []) as Subscription[]) {
      if (Date.now() - metrics.startedAt.getTime() >= MAX_EXECUTION_MS) {
        metrics.timedOut = true;
        break;
      }

      try {
        const weather = await fetchWeather(sub.latitude, sub.longitude, sub.timezone || 'UTC');
        const alerts = evaluateAlertRules({
          current: {
            temperature: weather.current.temperature_2m,
            uvIndex: weather.current.uv_index,
            windSpeed: weather.current.wind_speed_10m,
            windGust: weather.current.wind_gusts_10m,
          },
          hourly: {
            time: weather.hourly.time,
            temperature: weather.hourly.temperature_2m,
            humidity: weather.hourly.relative_humidity_2m,
            dewPoint: weather.hourly.dew_point_2m,
            windSpeed: weather.hourly.wind_speed_10m,
            windGust: weather.hourly.wind_gusts_10m,
            precipitationProbability: weather.hourly.precipitation_probability,
          },
          daily: {
            precipitationSum: weather.daily.precipitation_sum,
          },
          timezone: sub.timezone,
        }, sub.thresholds);

        const status = deriveGlobalStatus(alerts);
        const currentSnapshot = deriveAlertSnapshot(alerts);

        const { error: evaluationError } = await supabase.from('weather_alert_evaluations').insert({
          subscription_id: sub.id,
          chat_id: sub.chat_id,
          status,
          alerts,
          evaluated_at: new Date().toISOString(),
        });

        if (!recordEvaluationPersistenceResult(sub.id, evaluationError, metrics)) {
          continue;
        }

        const hasGlobalEscalation = isGlobalStatusEscalation(sub.last_status, status);
        const addedOrEscalatedTypes = shouldNotifyTypesWithCooldown(
          findAddedOrEscalatedAlertTypes(sub.last_alert_snapshot, currentSnapshot),
          sub.last_sent_at,
        );
        const shouldSendNotification =
          hasGlobalEscalation || addedOrEscalatedTypes.length > 0;
        const alertsToNotify = hasGlobalEscalation
          ? alerts
          : alerts.filter((alert) => addedOrEscalatedTypes.includes(alert.type));

        const nextSent = { ...(sub.last_sent_at ?? {}) };
        let telegramMessageAccepted = false;

        if (shouldSendNotification && alertsToNotify.length > 0) {
          telegramMessageAccepted = await sendTelegram(sub.chat_id, alertsToNotify);
          if (telegramMessageAccepted) {
            metrics.notificationsSent += alertsToNotify.length;
            alertsToNotify.forEach((a) => {
              nextSent[a.type] = new Date().toISOString();
            });
          }
        }

        const subscriptionUpdate: Record<string, unknown> = {
          last_status: status,
          last_alert_snapshot: currentSnapshot,
          last_evaluated_at: new Date().toISOString(),
        };
        if (Object.keys(nextSent).length > 0) {
          subscriptionUpdate.last_sent_at = nextSent;
        }

        const { error: updateError } = await supabase
          .from('weather_alert_subscriptions')
          .update(subscriptionUpdate)
          .eq('id', sub.id);

        recordSubscriptionUpdateResult(sub.id, updateError, telegramMessageAccepted, metrics);

        // Telegram and Postgres cannot participate in the same transaction. To fully prevent
        // duplicates after Telegram accepts a message but this update fails, introduce an
        // idempotent send ledger (unique delivery key) or an RPC-backed outbox before sending.
      } catch (subError) {
        metrics.errorsCount += 1;
        console.error('Error processing subscription', { subscriptionId: sub.id, subError });
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      processed: metrics.subscriptionsProcessed,
      notifications: metrics.notificationsSent,
      errors: metrics.errorsCount,
      timed_out: metrics.timedOut,
      batch_size: BATCH_SIZE,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    metrics.finishedAt = new Date();
    metrics.durationMs = metrics.finishedAt.getTime() - metrics.startedAt.getTime();

    if (metrics.lockAcquired) {
      await releaseLock(lockToken);
    }

    await persistRunMetrics(metrics);
  }
});
