-- Additive only: safe to run more than once, and it deletes nothing.

-- Records which one-off data loads have run, so anything you later delete is not added again.
create table if not exists public.data_loads (name text primary key, loaded_at timestamptz not null default now());

do $$
begin
  if not exists (select 1 from public.data_loads where name = 'price-list-2026') then
    insert into public.prices (id, name, category, price, status, notes)
    select v.id, v.name, v.category, v.price, 'Active', v.notes from (values
    ('PR-01', 'Starter Website', 'Websites', 3500, ''),
    ('PR-02', 'Professional Website', 'Websites', 5000, ''),
    ('PR-03', 'Premium Website', 'Websites', 7000, ''),
    ('PR-04', 'Landing Page', 'Websites', 3000, ''),
    ('PR-05', 'E-Commerce Store', 'Websites', 5500, ''),
    ('PR-06', 'AI Automation Suite', 'Automation', 9000, ''),
    ('PR-07', 'Online Booking & Payments', 'Add-ons', 1500, ''),
    ('PR-08', 'Domain & Email', 'Add-ons', 250, ''),
    ('PR-09', 'Hosting', 'Recurring', 50, 'First month free, then R50/month')
    ) as v(id, name, category, price, notes)
    where not exists (select 1 from public.prices x where lower(x.name) = lower(v.name))
    on conflict (id) do nothing;
    insert into public.data_loads (name) values ('price-list-2026');
  end if;

  -- Projects from the website portfolio. Fees, partners and dates are unknown and left blank.
  if not exists (select 1 from public.data_loads where name = 'portfolio-jobs') then
    insert into public.jobs (id, title, client, job_type, partner, value, status)
    select v.id, v.title, v.client, v.job_type, v.partner, v.value, v.status from (values
    ('J-PORT-01', 'Safe Cloud Africa', 'Safe Cloud Africa', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-02', 'Christian Leadership Movement', 'Christian Leadership Movement', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-03', 'Ashley Mash Portfolio', 'Ashley Mash Portfolio', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-04', 'Kagie App', 'Kagie App', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-05', 'Kagie App V2', 'Kagie App V2', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-06', 'MobileHealth V3', 'MobileHealth V3', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-07', 'NVM Frontend', 'NVM Frontend', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-08', 'AutoVital', 'AutoVital', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-09', '3D''s Sawmill', '3D''s Sawmill', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-10', 'CommunityHub2', 'CommunityHub2', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-11', 'Mzansi Prolife', 'Mzansi Prolife', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-12', 'Mzansi Prolife 2', 'Mzansi Prolife 2', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-13', 'Mzansi Prolife 3', 'Mzansi Prolife 3', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-14', 'Mzansi Prolife 1.2', 'Mzansi Prolife 1.2', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-15', 'NextWave Digital', 'NextWave Digital', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-16', 'Service Sync Three', 'Service Sync Three', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-17', 'Amder Maintenance Electrician', 'Amder Maintenance Electrician', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-18', 'Angela''s Kitchen', 'Angela''s Kitchen', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-19', 'MishMash Mediterranean', 'MishMash Mediterranean', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-20', '38 XI', '38 XI', 'Independent Work', '', 0, 'Done'),
    ('J-PORT-21', 'Jakarta EE School Management System', 'Jakarta EE School Management System', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-22', 'WoodsMen Restaurant Website', 'WoodsMen Restaurant Website', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-23', 'All-in-One Socials App', 'All-in-One Socials App', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-24', 'Thomson Sabie Website', 'Thomson Sabie Website', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-25', 'Car Website', 'Car Website', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-26', 'Connect Skill Tribe Website', 'Connect Skill Tribe Website', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-27', 'TJ''s Corner Kitchen', 'TJ''s Corner Kitchen', 'Independent Work', '', 0, 'In progress'),
    ('J-PORT-28', 'AshleyFx Robot Forex EA App', 'AshleyFx Robot Forex EA App', 'Independent Work', '', 0, 'In progress')
    ) as v(id, title, client, job_type, partner, value, status)
    where not exists (select 1 from public.jobs x where lower(x.title) = lower(v.title))
    on conflict (id) do nothing;
    insert into public.data_loads (name) values ('portfolio-jobs');
  end if;
end $$;

alter table public.clients add column if not exists address text;
alter table public.clients add column if not exists id_number text;
alter table public.clients add column if not exists vat_number text;

create table if not exists public.business_documents (
  id text primary key,
  type text not null,
  reference text not null,
  client_id text,
  status text not null default 'Draft',
  data jsonb not null,
  version integer not null default 1,
  total_cents bigint not null default 0,
  parent_id text,
  share_token_hash text,
  share_expires_at timestamptz,
  signed_at timestamptz,
  signed_pdf text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- A reference number is never used twice.
create unique index if not exists business_documents_reference_idx on public.business_documents (lower(reference));
create index if not exists business_documents_token_idx on public.business_documents (share_token_hash);

create table if not exists public.document_counters (
  key text primary key,
  last integer not null
);

create table if not exists public.document_events (
  id bigint generated always as identity primary key,
  document_id text not null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists document_events_doc_idx on public.document_events (document_id);

create table if not exists public.document_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

do $$
declare t text; r text;
begin
  foreach t in array array['data_loads','business_documents','document_counters','document_events','document_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    for r in select rolname from pg_roles where rolname in ('anon', 'authenticated') loop
      execute format('revoke all on public.%I from %I', t, r);
    end loop;
  end loop;
end $$;
