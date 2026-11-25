create table if not exists public.accounts (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null check (role in ('admin', 'partner', 'finance')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.invites (
  id text primary key,
  email text not null,
  role text not null check (role in ('partner', 'finance')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists invites_email_idx on public.invites(email);
create index if not exists accounts_role_idx on public.accounts(role);
