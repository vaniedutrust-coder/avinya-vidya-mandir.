-- Avinya Vidya Mandir website backend
-- Applied to Supabase project ccvvtjvmocuvlmmlsppw on 2026-09-30.

create extension if not exists pgcrypto;

create type public.inquiry_status as enum ('new','contacted','visit_scheduled','visited','application_started','admitted','closed');
create type public.admin_role as enum ('super_admin','admin','admissions','editor');

create table public.visit_requests (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null check (char_length(trim(parent_name)) between 2 and 120),
  phone text not null check (char_length(trim(phone)) between 7 and 30),
  grade text not null check (grade in ('Pre-Nursery','Nursery','LKG','UKG','Class 1')),
  preferred_date date not null,
  consent boolean not null default false check (consent = true),
  consent_version text not null default '2026-09-01',
  source text not null default 'website',
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null check (char_length(trim(parent_name)) between 2 and 120),
  phone text not null check (char_length(trim(phone)) between 7 and 30),
  email text,
  grade text,
  message text not null check (char_length(trim(message)) between 2 and 3000),
  consent boolean not null default false check (consent = true),
  consent_version text not null default '2026-09-01',
  source text not null default 'website',
  status public.inquiry_status not null default 'new',
  assigned_to uuid,
  notes text,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null default 'editor',
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inquiries add constraint inquiries_assigned_to_fkey foreign key (assigned_to) references public.admin_profiles(user_id) on delete set null;

create table public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.content_pages(id) on delete cascade,
  section_key text not null,
  heading text,
  body text,
  data jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, section_key)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  category text,
  caption text,
  alt_text text not null,
  featured boolean not null default false,
  web_approved boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  uploaded_by uuid references public.admin_profiles(user_id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.admin_profiles(user_id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.admin_profiles(user_id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_metadata jsonb,
  created_at timestamptz not null default now()
);

create index visit_requests_created_at_idx on public.visit_requests(created_at desc);
create index visit_requests_status_idx on public.visit_requests(status);
create index inquiries_created_at_idx on public.inquiries(created_at desc);
create index inquiries_status_idx on public.inquiries(status);
create index inquiries_assigned_to_idx on public.inquiries(assigned_to);
create index content_pages_status_idx on public.content_pages(status);
create index content_sections_page_status_idx on public.content_sections(page_id, status);
create index media_assets_published_idx on public.media_assets(published, web_approved, sort_order);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger visit_requests_updated_at before update on public.visit_requests for each row execute function public.set_updated_at();
create trigger inquiries_updated_at before update on public.inquiries for each row execute function public.set_updated_at();
create trigger admin_profiles_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
create trigger content_pages_updated_at before update on public.content_pages for each row execute function public.set_updated_at();
create trigger content_sections_updated_at before update on public.content_sections for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.visit_requests enable row level security;
alter table public.inquiries enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.content_pages enable row level security;
alter table public.content_sections enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

create policy "public can submit visit requests" on public.visit_requests for insert to anon, authenticated with check (true);
create policy "public can submit inquiries" on public.inquiries for insert to anon, authenticated with check (true);

create policy "authenticated admins can read visit requests" on public.visit_requests for select to authenticated using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true));
create policy "authenticated admins can update visit requests" on public.visit_requests for update to authenticated using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true)) with check (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true));
create policy "authenticated admins can read inquiries" on public.inquiries for select to authenticated using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true));
create policy "authenticated admins can update inquiries" on public.inquiries for update to authenticated using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true));
create policy "users can read own admin profile" on public.admin_profiles for select to authenticated using (user_id = auth.uid());

create policy "published pages are public" on public.content_pages for select to anon, authenticated using (status = 'published');
create policy "published sections are public" on public.content_sections for select to anon, authenticated using (status = 'published' and exists (select 1 from public.content_pages p where p.id = page_id and p.status = 'published'));
create policy "approved media are public" on public.media_assets for select to anon, authenticated using (published = true and web_approved = true);
create policy "authenticated admins can read settings" on public.site_settings for select to authenticated using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true));
create policy "authenticated admins can read audit logs" on public.audit_logs for select to authenticated using (exists (select 1 from public.admin_profiles p where p.user_id = auth.uid() and p.active = true));
