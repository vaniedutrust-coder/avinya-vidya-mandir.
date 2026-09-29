-- Security/performance hardening applied to Supabase project ccvvtjvmocuvlmmlsppw.
alter function public.set_updated_at() set search_path = public;
revoke execute on function public.rls_auto_enable() from anon, authenticated;

create index if not exists inquiries_assigned_to_idx on public.inquiries(assigned_to);
create index if not exists media_assets_uploaded_by_idx on public.media_assets(uploaded_by);
create index if not exists site_settings_updated_by_idx on public.site_settings(updated_by);
create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);

drop policy if exists "authenticated admins can read visit requests" on public.visit_requests;
create policy "authenticated admins can read visit requests" on public.visit_requests for select to authenticated
using (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true));

drop policy if exists "authenticated admins can update visit requests" on public.visit_requests;
create policy "authenticated admins can update visit requests" on public.visit_requests for update to authenticated
using (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true))
with check (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true));

drop policy if exists "authenticated admins can read inquiries" on public.inquiries;
create policy "authenticated admins can read inquiries" on public.inquiries for select to authenticated
using (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true));

drop policy if exists "authenticated admins can update inquiries" on public.inquiries;
create policy "authenticated admins can update inquiries" on public.inquiries for update to authenticated
using (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true))
with check (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true));

drop policy if exists "users can read own admin profile" on public.admin_profiles;
create policy "users can read own admin profile" on public.admin_profiles for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "authenticated admins can read settings" on public.site_settings;
create policy "authenticated admins can read settings" on public.site_settings for select to authenticated
using (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true));

drop policy if exists "authenticated admins can read audit logs" on public.audit_logs;
create policy "authenticated admins can read audit logs" on public.audit_logs for select to authenticated
using (exists (select 1 from public.admin_profiles p where p.user_id = (select auth.uid()) and p.active = true));
