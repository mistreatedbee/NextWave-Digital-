-- Additive only: safe to run more than once, and it deletes nothing.

create table if not exists public.work_log (
  id text primary key,
  log_date date,
  kind text,
  client text,
  job text,
  summary text,
  details text,
  next_steps text,
  follow_up date,
  link text,
  job_status text,
  partner text,
  status text default 'Open',
  created_at timestamptz not null default now()
);

create table if not exists public.domains (
  id text primary key,
  domain text,
  client text,
  job text,
  provider text,
  expires date,
  cost integer default 0,
  status text default 'Active',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.tasks add column if not exists client text;
alter table public.jobs add column if not exists payment_due date;
alter table public.invoices add column if not exists last_reminder date;

do $$
declare t text; r text;
begin
  foreach t in array array['work_log','domains'] loop
    execute format('alter table public.%I enable row level security', t);
    for r in select rolname from pg_roles where rolname in ('anon', 'authenticated') loop
      execute format('revoke all on public.%I from %I', t, r);
    end loop;
  end loop;
end $$;
