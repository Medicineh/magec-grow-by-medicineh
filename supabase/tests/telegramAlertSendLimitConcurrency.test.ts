import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MINUTE_LIMIT = 5;
const PARALLEL_REQUESTS = MINUTE_LIMIT + 10;
const runIntegration = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? describe : describe.skip;
const userId = `rate-limit-concurrency-${randomUUID()}`;
const ipAddress = '198.51.100.42';

runIntegration('consume_telegram_alert_send_limit concurrency', () => {
  let supabaseAdmin: ReturnType<typeof createClient>;

  beforeAll(async () => {
    supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { error } = await supabaseAdmin
      .from('telegram_alert_send_limits')
      .delete()
      .eq('user_id', userId)
      .eq('ip_address', ipAddress);

    expect(error).toBeNull();
  });

  afterAll(async () => {
    await supabaseAdmin
      .from('telegram_alert_send_limits')
      .delete()
      .eq('user_id', userId)
      .eq('ip_address', ipAddress);
  });

  it('authorizes only the minute limit when more requests consume it in parallel', async () => {
    const results = await Promise.all(
      Array.from({ length: PARALLEL_REQUESTS }, () =>
        supabaseAdmin.rpc('consume_telegram_alert_send_limit', {
          p_user_id: userId,
          p_ip_address: ipAddress,
          p_minute_limit: MINUTE_LIMIT,
          p_daily_limit: 100,
        }),
      ),
    );

    expect(results.every(({ error }) => error === null)).toBe(true);
    expect(results.filter(({ data }) => data === true)).toHaveLength(MINUTE_LIMIT);
    expect(results.filter(({ data }) => data === false)).toHaveLength(PARALLEL_REQUESTS - MINUTE_LIMIT);

    const { data: limit, error } = await supabaseAdmin
      .from('telegram_alert_send_limits')
      .select('minute_count,day_count')
      .eq('user_id', userId)
      .eq('ip_address', ipAddress)
      .single();

    expect(error).toBeNull();
    expect(limit).toMatchObject({ minute_count: MINUTE_LIMIT, day_count: MINUTE_LIMIT });
  });
});
