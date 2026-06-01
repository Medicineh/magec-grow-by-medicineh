alter table public.weather_alert_subscriptions enable row level security;
alter table public.weather_alert_evaluations enable row level security;
alter table public.telegram_alert_send_limits enable row level security;
alter table public.weather_alert_cron_control enable row level security;
alter table public.weather_alert_cron_runs enable row level security;

-- weather_alert_subscriptions: each authenticated user only accesses owned rows.
drop policy if exists weather_alert_subscriptions_select_own on public.weather_alert_subscriptions;
create policy weather_alert_subscriptions_select_own
  on public.weather_alert_subscriptions
  for select
  to authenticated
  using (owner_user_id = auth.uid());

drop policy if exists weather_alert_subscriptions_insert_own on public.weather_alert_subscriptions;
create policy weather_alert_subscriptions_insert_own
  on public.weather_alert_subscriptions
  for insert
  to authenticated
  with check (owner_user_id = auth.uid());

drop policy if exists weather_alert_subscriptions_update_own on public.weather_alert_subscriptions;
create policy weather_alert_subscriptions_update_own
  on public.weather_alert_subscriptions
  for update
  to authenticated
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

drop policy if exists weather_alert_subscriptions_delete_own on public.weather_alert_subscriptions;
create policy weather_alert_subscriptions_delete_own
  on public.weather_alert_subscriptions
  for delete
  to authenticated
  using (owner_user_id = auth.uid());

-- weather_alert_evaluations: users can only read evaluation rows tied to their subscriptions.
drop policy if exists weather_alert_evaluations_select_owner on public.weather_alert_evaluations;
create policy weather_alert_evaluations_select_owner
  on public.weather_alert_evaluations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.weather_alert_subscriptions s
      where s.id = weather_alert_evaluations.subscription_id
        and s.owner_user_id = auth.uid()
    )
  );

-- Backend-only operational tables: block direct client access.
drop policy if exists telegram_alert_send_limits_no_client_access on public.telegram_alert_send_limits;
create policy telegram_alert_send_limits_no_client_access
  on public.telegram_alert_send_limits
  for all
  to anon, authenticated
  using (false)
  with check (false);

drop policy if exists weather_alert_cron_control_no_client_access on public.weather_alert_cron_control;
create policy weather_alert_cron_control_no_client_access
  on public.weather_alert_cron_control
  for all
  to anon, authenticated
  using (false)
  with check (false);

drop policy if exists weather_alert_cron_runs_no_client_access on public.weather_alert_cron_runs;
create policy weather_alert_cron_runs_no_client_access
  on public.weather_alert_cron_runs
  for all
  to anon, authenticated
  using (false)
  with check (false);
