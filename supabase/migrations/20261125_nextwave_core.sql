create table if not exists public.partners (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null unique,
  status text not null default 'Trial',
  earnings integer not null default 0,
  jobs integer not null default 0,
  leads integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id text primary key,
  name text not null,
  company text not null,
  service text not null,
  source text,
  value integer not null default 0,
  partner text,
  stage text not null default 'New',
  logged_hours integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id text primary key,
  title text not null,
  client text not null,
  job_type text not null,
  partner text,
  value integer not null default 0,
  received integer not null default 0,
  status text not null default 'Not started',
  due date,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  payment_date date not null,
  client text not null,
  invoice text,
  job text,
  amount integer not null,
  method text,
  bank_charges integer not null default 0,
  status text not null default 'Pending',
  partner text,
  created_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id text primary key,
  partner text not null,
  batch date,
  gross integer not null default 0,
  amount integer not null default 0,
  status text not null default 'Scheduled',
  created_at timestamptz not null default now()
);
