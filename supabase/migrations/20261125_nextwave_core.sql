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

insert into public.partners (name,email,status,earnings,jobs,leads) values
('Thandi Mokoena','thandi@nextwave.co.za','Trial',18450,7,14),
('Sipho Ndlovu','sipho@nextwave.co.za','Active',46200,15,29),
('Lerato Khumalo','lerato@nextwave.co.za','Active',61850,19,33),
('Ayesha Patel','ayesha@nextwave.co.za','Active',27900,9,18),
('Johan van Wyk','johan@nextwave.co.za','Trial',1200,1,4)
on conflict (email) do nothing;

insert into public.leads (id,name,company,service,source,value,partner,stage,logged_hours,created_at) values
('L-1042','Nomvula Dlamini','Soweto Bakes','Website','Referral',8500,'Thandi Mokoena','New',3,'2026-11-24'),
('L-1041','Pieter Botha','Botha Plumbing','Automation','Facebook',14500,'Sipho Ndlovu','Contacted',30,'2026-11-23'),
('L-1040','Zanele Mthembu','Mthembu Tutors','Tutoring','Instagram',3200,'Thandi Mokoena','Quote sent',6,'2026-11-21'),
('L-1039','Kagiso Molefe','Molefe Logistics','App','LinkedIn',68000,'Lerato Khumalo','Quote sent',2,'2026-11-19')
on conflict (id) do nothing;

insert into public.jobs (id,title,client,job_type,partner,value,received,status,due) values
('J-318','Logo touch-up & favicon','Steyn Guesthouse','Standard Job','Thandi Mokoena',450,450,'Done','2026-11-20'),
('J-317','Essop & Co website rebuild','Essop & Co Attorneys','Independent Work','Ayesha Patel',22000,11000,'In progress','2026-12-12'),
('J-316','Invoice automation','Venter Accounting','Assisted Work','Lerato Khumalo',18500,18500,'Review','2026-11-28'),
('J-315','Fleet tracking app — Phase 1','Molefe Logistics','Major Project','Lerato Khumalo',68000,34000,'In progress','2027-02-27')
on conflict (id) do nothing;

insert into public.payments (id,payment_date,client,invoice,job,amount,method,bank_charges,status,partner) values
('PAY-2291','2026-11-24','Molefe Logistics','INV-0418','J-315',34000,'EFT',0,'Cleared','Lerato Khumalo'),
('PAY-2290','2026-11-22','Venter Accounting','INV-0416','J-316',9250,'EFT',0,'Cleared','Lerato Khumalo'),
('PAY-2289','2026-11-21','Zulu Fitness','INV-0415','J-313',3250,'Card (Yoco)',94,'Pending','Thandi Mokoena')
on conflict (id) do nothing;

insert into public.payouts (id,partner,batch,gross,amount,status) values
('PO-0147','Lerato Khumalo','2026-11-27',43250,15820,'Scheduled'),
('PO-0146','Thandi Mokoena','2026-11-27',2850,2030,'Scheduled'),
('PO-0145','Ayesha Patel','2026-11-20',11000,7650,'Paid')
on conflict (id) do nothing;
