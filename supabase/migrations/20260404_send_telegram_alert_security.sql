alter table public.weather_alert_subscriptions
  add column if not exists owner_user_id uuid;

create index if not exists weather_alert_subscriptions_owner_chat_idx
  on public.weather_alert_subscriptions(owner_user_id, chat_id);

create table if not exists public.telegram_alert_send_limits (
  user_id text not null,
  ip_address text not null,
  minute_window_start timestamptz not null,
  minute_count integer not null default 0,
  day_window_start timestamptz not null,
  day_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, ip_address)
);

create index if not exists telegram_alert_send_limits_day_window_idx
  on public.telegram_alert_send_limits(day_window_start);
