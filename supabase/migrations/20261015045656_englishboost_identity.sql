create schema if not exists private;
create table public.tutor_accounts (email text primary key);
alter table public.tutor_accounts enable row level security;
insert into public.tutor_accounts values ('abdushynggys@gmail.com');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null, full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'tutor')),
  approved boolean not null default false,
  goal text not null default 'Improve school grades',
  weekly_target integer not null default 3 check (weekly_target between 1 and 7),
  created_at timestamptz not null default now()
);
create table public.tutor_students (
  user_id uuid references public.profiles on delete cascade,
  tutor_id uuid references public.profiles on delete cascade,
  primary key (user_id, tutor_id), check (user_id <> tutor_id)
);
create table public.student_invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  email text not null, created_at timestamptz not null default now(),
  unique(user_id, email)
);
alter table public.profiles enable row level security;
alter table public.tutor_students enable row level security;
alter table public.student_invitations enable row level security;

create function private.is_tutor() returns boolean language sql stable security definer
set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'tutor');
$$;
create function private.can_access(student_id uuid) returns boolean language sql stable security definer
set search_path = '' as $$
  select auth.uid() = student_id or exists (
    select 1 from public.tutor_students where user_id = student_id and tutor_id = auth.uid()
  );
$$;
create function private.is_approved() returns boolean language sql stable security definer
set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and approved);
$$;
revoke all on function private.is_tutor(), private.can_access(uuid), private.is_approved() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_tutor(), private.can_access(uuid), private.is_approved() to authenticated;

create function private.create_profile() returns trigger language plpgsql security definer
set search_path = '' as $$
declare tutor boolean;
begin
  tutor := exists(select 1 from public.tutor_accounts where email = lower(new.email));
  insert into public.profiles(id, email, full_name, role, approved)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when tutor then 'tutor' else 'student' end,
    tutor or exists(select 1 from public.student_invitations where email = lower(new.email)));
  insert into public.tutor_students(user_id, tutor_id)
    select new.id, user_id from public.student_invitations where email = lower(new.email)
    and user_id <> new.id on conflict do nothing;
  return new;
end; $$;
create trigger englishboost_profile after insert on auth.users
for each row execute procedure private.create_profile();

insert into public.profiles(id, email, full_name, role, approved)
select id, lower(email), coalesce(raw_user_meta_data->>'full_name', ''),
  case when exists(select 1 from public.tutor_accounts t where t.email = lower(u.email)) then 'tutor' else 'student' end,
  exists(select 1 from public.tutor_accounts t where t.email = lower(u.email))
from auth.users u where email is not null on conflict do nothing;

create policy "profile readers" on public.profiles for select to authenticated using (private.can_access(id));
create policy "own profile settings" on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update(full_name, goal, weekly_target) on public.profiles to authenticated;
create policy "view own student links" on public.tutor_students for select to authenticated
using (user_id = auth.uid() or tutor_id = auth.uid());
create policy "own invitations" on public.student_invitations for select to authenticated using (user_id = auth.uid());

create function public.approve_student(student_email text) returns void
language plpgsql security definer set search_path = '' as $$
declare student_id uuid;
begin
  if not private.is_tutor() then raise exception 'Tutor access required'; end if;
  if length(student_email) > 254 or student_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    then raise exception 'Enter a valid student email'; end if;
  insert into public.student_invitations(user_id, email) values(auth.uid(), lower(trim(student_email))) on conflict do nothing;
  select id into student_id from public.profiles where email = lower(trim(student_email)) and role = 'student';
  if student_id is not null then
    insert into public.tutor_students values(student_id, auth.uid()) on conflict do nothing;
    update public.profiles set approved = true where id = student_id;
  end if;
end; $$;
revoke all on function public.approve_student(text) from public;
grant execute on function public.approve_student(text) to authenticated;
