-- Quarantine legacy subscriptions that predate owner_user_id.
--
-- Transition policy: ownerless rows are disabled until an operator verifies the
-- claimant through an out-of-band process. Knowing chat_id is not sufficient
-- evidence and this migration intentionally exposes no client-callable claim
-- function.

create table if not exists public.weather_alert_subscription_owner_remediation (
  subscription_id uuid primary key,
  previous_is_active boolean not null,
  transition_action text not null default 'deactivated_pending_verified_claim'
    check (transition_action in (
      'deactivated_pending_verified_claim',
      'claimed_after_verification',
      'retired_as_obsolete'
    )),
  detected_at timestamptz not null default now(),
  claimed_owner_user_id uuid,
  claimed_at timestamptz,
  verification_reference text,
  check (
    transition_action <> 'claimed_after_verification'
    or (
      claimed_owner_user_id is not null
      and claimed_at is not null
      and nullif(btrim(verification_reference), '') is not null
    )
  )
);

comment on table public.weather_alert_subscription_owner_remediation is
  'Operator-only audit queue for legacy ownerless weather subscriptions. Claims require independently verified evidence; chat_id alone is never sufficient.';
comment on column public.weather_alert_subscription_owner_remediation.verification_reference is
  'Operator-controlled reference to independent ownership verification, such as a support ticket or bot challenge record. Never accept chat_id alone.';

alter table public.weather_alert_subscription_owner_remediation enable row level security;
revoke all on table public.weather_alert_subscription_owner_remediation from anon, authenticated;

-- Persistently identify every historical row that needs remediation before
-- mutating it so operators can review the queue and recover safely.
insert into public.weather_alert_subscription_owner_remediation (
  subscription_id,
  previous_is_active
)
select
  id,
  is_active
from public.weather_alert_subscriptions
where owner_user_id is null
on conflict (subscription_id) do nothing;

-- Quarantine legacy rows. They remain available to privileged operators for a
-- verified claim or retirement, but cron must not process them in the meantime.
update public.weather_alert_subscriptions
set
  is_active = false,
  updated_at = now()
where owner_user_id is null
  and is_active;

-- owner_user_id deliberately remains nullable so quarantined rows can be kept
-- pending a verified claim. The functional invariant is narrower: an active
-- subscription must always have an owner.
alter table public.weather_alert_subscriptions
  add constraint weather_alert_subscriptions_active_requires_owner
  check (not is_active or owner_user_id is not null)
  not valid;

alter table public.weather_alert_subscriptions
  validate constraint weather_alert_subscriptions_active_requires_owner;
