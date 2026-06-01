alter table public.weather_alert_subscriptions
  add column if not exists last_alert_snapshot jsonb;
