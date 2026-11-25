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

truncate table public.partners, public.leads, public.jobs, public.payments, public.payouts, public.clients;
