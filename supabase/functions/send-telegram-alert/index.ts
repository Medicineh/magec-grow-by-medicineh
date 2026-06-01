import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const TELEGRAM_SEND_API_SECRET = Deno.env.get('TELEGRAM_SEND_API_SECRET') ?? '';
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const MAX_MESSAGE_LENGTH = 1000;
const MINUTE_LIMIT = 5;
const DAILY_LIMIT = 100;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface TelegramPayload {
  chatId?: string;
  message?: string;
}

interface AuthContext {
  userId: string;
  authMethod: 'jwt' | 'api-secret';
}

function resolveAllowedOrigin(origin: string | null): string | null {
  if (!origin || ALLOWED_ORIGINS.length === 0) return null;
  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

function buildCorsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = resolveAllowedOrigin(origin);
  return {
    'Content-Type': 'application/json',
    ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
    'Access-Control-Allow-Headers': 'authorization, x-api-secret, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function jsonResponse(body: Record<string, unknown>, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: buildCorsHeaders(origin),
  });
}

function sanitizeTelegramHtml(input: string): string {
  const withoutUnsafeTags = input
    .replace(/<(?!\/?(b|strong|i|em|u|ins|s|strike|del|code|pre|a)\b)[^>]*>/gi, '')
    .replace(/<a\s+([^>]*?)>/gi, (full, attrs: string) => {
      const hrefMatch = attrs.match(/href\s*=\s*['"]([^'"]+)['"]/i);
      if (!hrefMatch) return '';
      const href = hrefMatch[1];
      if (!/^https?:\/\//i.test(href)) return '';
      return `<a href="${href}">`;
    });

  return withoutUnsafeTags.slice(0, MAX_MESSAGE_LENGTH);
}

async function authenticateRequest(req: Request): Promise<AuthContext | null> {
  const authHeader = req.headers.get('Authorization') ?? '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (!token) return null;

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error('JWT validation failed', error?.message ?? 'no_user');
      return null;
    }

    return { userId: user.id, authMethod: 'jwt' };
  }

  const apiSecret = req.headers.get('x-api-secret') ?? '';
  if (TELEGRAM_SEND_API_SECRET && apiSecret && apiSecret === TELEGRAM_SEND_API_SECRET) {
    return { userId: 'backend-service', authMethod: 'api-secret' };
  }

  return null;
}

async function enforceRateLimit(userId: string, ipAddress: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc('consume_telegram_alert_send_limit', {
    p_user_id: userId,
    p_ip_address: ipAddress,
    p_minute_limit: MINUTE_LIMIT,
    p_daily_limit: DAILY_LIMIT,
  });

  if (error) {
    console.error('Rate limit consumption failed', error.message);
    return false;
  }

  if (data !== true) {
    console.warn('Rate limit exceeded', { userId, ipAddress });
    return false;
  }

  return true;
}

async function authorizeChatId(auth: AuthContext, chatId: string): Promise<boolean> {
  if (auth.authMethod === 'api-secret') return true;

  const { data, error } = await supabaseAdmin
    .from('weather_alert_subscriptions')
    .select('id')
    .eq('chat_id', chatId)
    .eq('owner_user_id', auth.userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Chat ownership lookup failed', error.message);
    return false;
  }

  return Boolean(data);
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');

  if (req.method === 'OPTIONS') return jsonResponse({ ok: true }, 200, origin);

  if (req.method !== 'POST') return jsonResponse({ error: 'Request rejected' }, 405, origin);

  if (!TELEGRAM_BOT_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment configuration');
    return jsonResponse({ error: 'Service unavailable' }, 503, origin);
  }

  const auth = await authenticateRequest(req);
  if (!auth) {
    return jsonResponse({ error: 'Request rejected' }, 401, origin);
  }

  const forwardedFor = req.headers.get('x-forwarded-for') ?? '';
  const ipAddress = forwardedFor.split(',')[0]?.trim() || 'unknown';

  const underLimit = await enforceRateLimit(auth.userId, ipAddress);
  if (!underLimit) {
    return jsonResponse({ error: 'Request rejected' }, 429, origin);
  }

  let payload: TelegramPayload;
  try {
    payload = (await req.json()) as TelegramPayload;
  } catch {
    return jsonResponse({ error: 'Request rejected' }, 400, origin);
  }

  const chatId = typeof payload.chatId === 'string' ? payload.chatId.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!chatId || !message) {
    return jsonResponse({ error: 'Request rejected' }, 400, origin);
  }

  const isAllowedChat = await authorizeChatId(auth, chatId);
  if (!isAllowedChat) {
    return jsonResponse({ error: 'Request rejected' }, 403, origin);
  }

  const sanitizedMessage = sanitizeTelegramHtml(message);
  if (!sanitizedMessage) {
    return jsonResponse({ error: 'Request rejected' }, 400, origin);
  }

  try {
    const telegramResponse = await fetch(`${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: sanitizedMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      const responseBody = await telegramResponse.json().catch(() => null) as { description?: string } | null;
      console.error('Telegram API rejected message', {
        status: telegramResponse.status,
        description: responseBody?.description ?? 'unknown',
      });
      return jsonResponse({ error: 'Request rejected' }, 502, origin);
    }

    return jsonResponse({ ok: true }, 200, origin);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown_error';
    console.error('Unexpected send-telegram-alert error', detail);
    return jsonResponse({ error: 'Request rejected' }, 500, origin);
  }
});
