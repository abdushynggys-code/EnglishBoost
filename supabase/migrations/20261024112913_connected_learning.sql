-- Independent learning is available without a tutor or class.
update public.profiles set approved=true where role='student';
create or replace function private.create_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare tutor boolean;
begin
 tutor:=exists(select 1 from public.tutor_accounts where email=lower(new.email));
 insert into public.profiles(id,email,full_name,role,approved) values(new.id,lower(new.email),coalesce(new.raw_user_meta_data->>'full_name',''),case when tutor then 'tutor' else 'student' end,true);
 insert into public.tutor_students(user_id,tutor_id) select new.id,user_id from public.student_invitations where email=lower(new.email) and user_id<>new.id on conflict do nothing;
 return new;
end $$;
create table public.learning_classes(id uuid primary key default gen_random_uuid(),user_id uuid not null default auth.uid() references public.profiles on delete cascade,title text not null check(length(title) between 2 and 100),code text not null unique default upper(encode(extensions.gen_random_bytes(5),'hex')),created_at timestamptz not null default now());
create table public.class_members(user_id uuid not null default auth.uid() references public.profiles on delete cascade,class_id uuid not null references public.learning_classes on delete cascade,joined_at timestamptz not null default now(),primary key(user_id,class_id));
create table public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,title text not null,body text not null default '',href text not null default '/course',read_at timestamptz,created_at timestamptz not null default now());
create table public.developer_accounts(user_id uuid primary key references public.profiles on delete cascade,created_at timestamptz not null default now());
alter table public.learning_classes enable row level security;
alter table public.class_members enable row level security;
alter table public.notifications enable row level security;
alter table public.developer_accounts enable row level security;
create function private.in_class(class_uuid uuid) returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.class_members where user_id=auth.uid() and class_id=class_uuid)$$;
revoke all on function private.in_class(uuid) from public;
grant execute on function private.in_class(uuid) to authenticated;
create policy "own or joined classes" on public.learning_classes for select to authenticated using(auth.uid()=user_id or private.in_class(id));
create policy "tutors create own classes" on public.learning_classes for insert to authenticated with check(auth.uid()=user_id and private.is_tutor());
create policy "own memberships" on public.class_members for select to authenticated using(auth.uid()=user_id or exists(select 1 from public.learning_classes c where c.id=class_id and c.user_id=auth.uid()));
create policy "own notifications" on public.notifications for select to authenticated using(auth.uid()=user_id);
create policy "read own notifications" on public.notifications for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "own developer access" on public.developer_accounts for select to authenticated using(auth.uid()=user_id);
grant select,insert on public.learning_classes to authenticated;
grant select on public.class_members,public.notifications,public.developer_accounts to authenticated;
grant update(read_at) on public.notifications to authenticated;
create index on public.notifications(user_id,created_at desc);
create function public.join_learning_class(class_code text) returns void language plpgsql security definer set search_path='' as $$
declare room public.learning_classes;
begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 if length(trim(class_code))<>10 then raise exception 'Enter a 10-character class code'; end if;
 select * into room from public.learning_classes where code=upper(trim(class_code));
 if room.id is null then raise exception 'Class code not found'; end if;
 if room.user_id=auth.uid() then raise exception 'This is your own class'; end if;
 insert into public.class_members(user_id,class_id) values(auth.uid(),room.id) on conflict do nothing;
 insert into public.tutor_students(user_id,tutor_id) values(auth.uid(),room.user_id) on conflict do nothing;
 insert into public.notifications(user_id,title,body,href) values(auth.uid(),'Class joined',room.title,'/classroom');
end $$;
revoke all on function public.join_learning_class(text) from public;
grant execute on function public.join_learning_class(text) to authenticated;
create function public.assign_class_work(class_uuid uuid,work_title text,work_instructions text,due_date date,practice text default '/course') returns integer language plpgsql security definer set search_path='' as $$
declare student record; assigned integer:=0;
begin
 if not private.is_tutor() or not exists(select 1 from public.learning_classes where id=class_uuid and user_id=auth.uid()) then raise exception 'Tutor access required'; end if;
 if length(trim(work_title)) not between 2 and 160 or length(work_instructions)>5000 or due_date<current_date or practice not like '/%' or practice like '//%' then raise exception 'Invalid assignment'; end if;
 for student in select user_id from public.class_members where class_id=class_uuid loop
 insert into public.homework_assignments(user_id,tutor_id,title,instructions,due_at,practice_path) values(student.user_id,auth.uid(),trim(work_title),work_instructions,due_date,practice);
 assigned:=assigned+1;
 end loop;
 return assigned;
end $$;
revoke all on function public.assign_class_work(uuid,text,text,date,text) from public;
grant execute on function public.assign_class_work(uuid,text,text,date,text) to authenticated;
create function private.notify_assignment() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.notifications(user_id,title,body,href) values(new.user_id,'New assignment',new.title,'/homework');return new;
end $$;
create trigger notify_new_assignment after insert on public.homework_assignments for each row execute procedure private.notify_assignment();
