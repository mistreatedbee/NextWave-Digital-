-- Additive only: safe to run more than once, and it deletes nothing.

create table if not exists public.clients (
  id text primary key,
  name text not null,
  company text not null,
  email text,
  phone text,
  service text,
  status text not null default 'Active',
  value integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.clients add column if not exists partner text;
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists last_activity_at timestamptz not null default now();
alter table public.jobs add column if not exists major_share integer;
alter table public.jobs add column if not exists bank_charges integer not null default 0;
alter table public.jobs add column if not exists third_party integer not null default 0;
alter table public.jobs add column if not exists contributor_pct integer not null default 0;
alter table public.payouts add column if not exists job text;
alter table public.payouts add column if not exists cleared_date date;

create table if not exists public.quotes (
  id text primary key,
  client text,
  title text,
  partner text,
  status text,
  amount integer default 0,
  discount_pct integer default 0,
  valid_until date,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  client text,
  job text,
  status text,
  amount integer default 0,
  paid integer default 0,
  issued date,
  due date,
  created_at timestamptz not null default now()
);

create table if not exists public.prices (
  id text primary key,
  name text,
  category text,
  status text,
  notes text,
  price integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  title text,
  job text,
  partner text,
  priority text,
  status text,
  due date,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text,
  event_time text,
  kind text,
  partner text,
  notes text,
  event_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.help_requests (
  id text primary key,
  job text,
  summary text,
  partner text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id text primary key,
  kind text,
  summary text,
  partner text,
  status text not null default 'Pending',
  amount integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id text primary key,
  summary text,
  category text,
  job text,
  status text,
  amount integer default 0,
  expense_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.contributors (
  id text primary key,
  name text,
  job text,
  contribution text,
  status text,
  pct integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.social_accounts (
  id text primary key,
  platform text,
  handle text,
  link text,
  manager text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.content (
  id text primary key,
  title text,
  channel text,
  partner text,
  status text,
  notes text,
  publish_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id text primary key,
  name text,
  channel text,
  partner text,
  status text,
  budget integer default 0,
  leads_generated integer default 0,
  starts date,
  ends date,
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id text primary key,
  name text,
  channel text,
  body text,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id text primary key,
  student_name text,
  grade text,
  subject text,
  parent_name text,
  parent_phone text,
  consent text,
  partner text,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id text primary key,
  student text,
  subject text,
  session_time text,
  partner text,
  status text,
  notes text,
  session_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.safety_incidents (
  id text primary key,
  summary text,
  severity text,
  status text,
  action_taken text,
  incident_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key,
  title text,
  kind text,
  link text,
  partner text,
  status text not null default 'Pending review',
  expires date,
  created_at timestamptz not null default now()
);

create table if not exists public.popia_requests (
  id text primary key,
  requester text,
  kind text,
  status text,
  notes text,
  received_on date,
  due date,
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding (
  id text primary key,
  partner text,
  item text,
  status text not null default 'Missing',
  created_at timestamptz not null default now()
);

create table if not exists public.kb_articles (
  id text primary key,
  title text,
  category text,
  body text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key,
  name text,
  setting_value text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor text not null,
  action text not null,
  entity text not null,
  entity_id text,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.login_attempts (
  id text primary key,
  key text not null,
  attempted_at timestamptz not null
);
create index if not exists login_attempts_key_idx on public.login_attempts(key, attempted_at);

-- Partner names link records to people, so they must be unique.
create unique index if not exists accounts_name_idx on public.accounts (lower(name));

-- Give existing partner accounts a profile and an onboarding checklist.
insert into public.partners (name, email)
select a.name, a.email from public.accounts a
where a.role = 'partner' and not exists (select 1 from public.partners p where lower(p.email) = a.email);

insert into public.onboarding (id, partner, item)
select 'OB-' || a.id || '-' || i.n, a.name, i.item
from public.accounts a
cross join (values (1, 'Information form'), (2, 'NDA signed'), (3, 'Partnership & Commission Agreement'), (4, 'Police clearance'), (5, 'System access'), (6, 'Training: commission & POPIA')) as i(n, item)
where a.role = 'partner' and not exists (select 1 from public.onboarding o where o.partner = a.name)
on conflict (id) do nothing;

-- Only the application's own database user may touch these tables; the public Supabase roles may not.
do $$
declare t text; r text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' and tablename in (
    'accounts','invites','partners','leads','jobs','payments','payouts','clients','quotes','invoices','prices','tasks','events','help_requests','approvals','expenses','contributors','social_accounts','content','campaigns','templates','students','sessions','safety_incidents','documents','popia_requests','onboarding','kb_articles','settings','audit_log','login_attempts')
  loop
    execute format('alter table public.%I enable row level security', t);
    for r in select rolname from pg_roles where rolname in ('anon', 'authenticated') loop
      execute format('revoke all on public.%I from %I', t, r);
    end loop;
  end loop;
end $$;
