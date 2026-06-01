create table if not exists public.weather_alert_cron_control (
  job_name text primary key,
  lock_token uuid,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.weather_alert_cron_control (job_name)
values ('weather-alert-cron')
on conflict (job_name) do nothing;

create table if not exists public.weather_alert_cron_runs (
  id bigint generated always as identity primary key,
  job_name text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz not null,
  duration_ms integer not null,
  subscriptions_processed integer not null default 0,
  notifications_sent integer not null default 0,
  errors_count integer not null default 0,
  timed_out boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists weather_alert_cron_runs_job_started_idx
  on public.weather_alert_cron_runs (job_name, started_at desc);
