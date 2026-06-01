create or replace function public.consume_telegram_alert_send_limit(
  p_user_id text,
  p_ip_address text,
  p_minute_limit integer default 5,
  p_daily_limit integer default 100
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_minute_window_start timestamptz := date_trunc('minute', v_now);
  v_day_window_start timestamptz := date_trunc('day', v_now at time zone 'UTC') at time zone 'UTC';
  v_limit public.telegram_alert_send_limits%rowtype;
begin
  if p_user_id is null or btrim(p_user_id) = ''
    or p_ip_address is null or btrim(p_ip_address) = ''
    or p_minute_limit <= 0
    or p_daily_limit <= 0
  then
    return false;
  end if;

  insert into public.telegram_alert_send_limits (
    user_id,
    ip_address,
    minute_window_start,
    minute_count,
    day_window_start,
    day_count,
    updated_at
  )
  values (
    p_user_id,
    p_ip_address,
    v_minute_window_start,
    0,
    v_day_window_start,
    0,
    v_now
  )
  on conflict (user_id, ip_address) do nothing;

  select *
    into strict v_limit
    from public.telegram_alert_send_limits
    where user_id = p_user_id
      and ip_address = p_ip_address
    for update;

  if v_limit.minute_window_start < v_minute_window_start then
    v_limit.minute_window_start := v_minute_window_start;
    v_limit.minute_count := 0;
  end if;

  if v_limit.day_window_start < v_day_window_start then
    v_limit.day_window_start := v_day_window_start;
    v_limit.day_count := 0;
  end if;

  if v_limit.minute_count >= p_minute_limit or v_limit.day_count >= p_daily_limit then
    update public.telegram_alert_send_limits
      set minute_window_start = v_limit.minute_window_start,
          minute_count = v_limit.minute_count,
          day_window_start = v_limit.day_window_start,
          day_count = v_limit.day_count,
          updated_at = v_now
      where user_id = p_user_id
        and ip_address = p_ip_address;

    return false;
  end if;

  update public.telegram_alert_send_limits
    set minute_window_start = v_limit.minute_window_start,
        minute_count = v_limit.minute_count + 1,
        day_window_start = v_limit.day_window_start,
        day_count = v_limit.day_count + 1,
        updated_at = v_now
    where user_id = p_user_id
      and ip_address = p_ip_address;

  return true;
end;
$$;

revoke all on function public.consume_telegram_alert_send_limit(text, text, integer, integer) from public;
revoke all on function public.consume_telegram_alert_send_limit(text, text, integer, integer) from anon, authenticated;
grant execute on function public.consume_telegram_alert_send_limit(text, text, integer, integer) to service_role;

revoke all on table public.telegram_alert_send_limits from anon, authenticated;
