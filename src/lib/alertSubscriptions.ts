import { supabase } from '@/integrations/supabase/client';
import { AlertThresholds } from '@/lib/alertRules';
import { Database, Json } from '@/integrations/supabase/types';

type WeatherAlertSubscriptionInsert =
  Database['public']['Tables']['weather_alert_subscriptions']['Insert'];
type WeatherAlertEvaluationRow =
  Database['public']['Tables']['weather_alert_evaluations']['Row'];

type AlertStatus = 'normal' | 'warning' | 'danger';

export interface AlertSubscriptionPayload {
  locationName: WeatherAlertSubscriptionInsert['location_name'];
  latitude: WeatherAlertSubscriptionInsert['latitude'];
  longitude: WeatherAlertSubscriptionInsert['longitude'];
  timezone: NonNullable<WeatherAlertSubscriptionInsert['timezone']>;
  chatId: WeatherAlertSubscriptionInsert['chat_id'];
  thresholds: AlertThresholds & Extract<WeatherAlertSubscriptionInsert['thresholds'], Record<string, Json>>;
}

export interface AlertEvaluationRecord
  extends Pick<WeatherAlertEvaluationRow, 'id' | 'evaluated_at'> {
  status: AlertStatus;
  alerts: {
    type: string;
    severity: AlertStatus;
    message: string;
  }[];
}

function normalizeStatus(value: string): AlertStatus {
  if (value === 'danger' || value === 'warning') return value;
  return 'normal';
}

function parseAlerts(value: WeatherAlertEvaluationRow['alerts']): AlertEvaluationRecord['alerts'] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];

    const candidate = item as Record<string, Json>;
    if (
      typeof candidate.type !== 'string' ||
      typeof candidate.message !== 'string' ||
      typeof candidate.severity !== 'string'
    ) {
      return [];
    }

    return [
      {
        type: candidate.type,
        severity: normalizeStatus(candidate.severity),
        message: candidate.message,
      },
    ];
  });
}

async function getRequiredUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error('Authentication required to manage alert subscriptions');
  }

  return user.id;
}

export async function upsertAlertSubscription(payload: AlertSubscriptionPayload) {
  const userId = await getRequiredUserId();

  return supabase
    .from('weather_alert_subscriptions')
    .upsert(
      {
        location_name: payload.locationName,
        latitude: payload.latitude,
        longitude: payload.longitude,
        timezone: payload.timezone,
        chat_id: payload.chatId,
        thresholds: payload.thresholds,
        owner_user_id: userId,
        is_active: true,
      },
      { onConflict: 'chat_id' },
    );
}

export async function getAlertEvaluationHistory(chatId: string, limit = 20): Promise<AlertEvaluationRecord[]> {
  await getRequiredUserId();

  const { data } = await supabase
    .from('weather_alert_evaluations')
    .select('id,evaluated_at,status,alerts')
    .eq('chat_id', chatId)
    .order('evaluated_at', { ascending: false })
    .limit(limit);

  return (data ?? []).map((row) => ({
    id: row.id,
    evaluated_at: row.evaluated_at,
    status: normalizeStatus(row.status),
    alerts: parseAlerts(row.alerts),
  }));
}

export async function getLatestAlertEvaluation(chatId: string): Promise<AlertEvaluationRecord | null> {
  const history = await getAlertEvaluationHistory(chatId, 1);
  return history[0] ?? null;
}
