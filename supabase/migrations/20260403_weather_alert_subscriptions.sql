create extension if not exists pgcrypto;

create table if not exists public.weather_alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  location_name text not null,
  latitude double precision not null,
  longitude double precision not null,
  timezone text not null default 'UTC',
  chat_id text not null unique,
  thresholds jsonb not null,
  is_active boolean not null default true,
  last_status text,
  last_sent_at jsonb,
  last_evaluated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weather_alert_evaluations (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.weather_alert_subscriptions(id) on delete cascade,
  chat_id text not null,
  status text not null,
  alerts jsonb not null default '[]'::jsonb,
  evaluated_at timestamptz not null default now()
);

create index if not exists weather_alert_evaluations_chat_idx
  on public.weather_alert_evaluations(chat_id, evaluated_at desc);
