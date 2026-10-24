-- Class identity, homework attribution and private, class-scoped summaries.
alter table public.homework_assignments add column class_id uuid references public.learning_classes on delete set null;
create index on public.homework_assignments(class_id,user_id);
update public.homework_assignments h set class_id=(select min(c.id::text)::uuid from public.learning_classes c join public.class_members m on m.class_id=c.id where c.user_id=h.tutor_id and m.user_id=h.user_id and c.created_at<=h.created_at)
 where 1=(select count(*) from public.learning_classes c join public.class_members m on m.class_id=c.id where c.user_id=h.tutor_id and m.user_id=h.user_id and c.created_at<=h.created_at);
create or replace function public.assign_class_work(class_uuid uuid,work_title text,work_instructions text,due_date date,practice text default '/course') returns integer language plpgsql security definer set search_path='' as $$
declare student record; assigned integer:=0;
begin
 if not private.is_tutor() or not exists(select 1 from public.learning_classes where id=class_uuid and user_id=auth.uid()) then raise exception 'Tutor access required'; end if;
 if length(trim(work_title)) not between 2 and 160 or length(work_instructions)>5000 or due_date<current_date or practice not like '/%' or practice like '//%' then raise exception 'Invalid assignment'; end if;
 for student in select user_id from public.class_members where class_id=class_uuid loop
 insert into public.homework_assignments(user_id,tutor_id,title,instructions,due_at,practice_path,class_id) values(student.user_id,auth.uid(),trim(work_title),work_instructions,due_date,practice,class_uuid);
 assigned:=assigned+1;
 end loop;
 return assigned;
end $$;
create function public.class_overview(class_uuid uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare room public.learning_classes; members jsonb; work jsonb;
begin
 select * into room from public.learning_classes where id=class_uuid and (user_id=auth.uid() or private.in_class(id));
 if room.id is null then raise exception 'Class not found or access denied';end if;
 select coalesce(jsonb_agg(to_jsonb(roster) order by roster.xp desc,roster.name,roster.user_id),'[]'::jsonb) into members from (
 select p.id as user_id,coalesce(nullif(trim(p.full_name),''),'Learner') as name,coalesce(w.xp,0) as xp,coalesce(cp.placement->>'level','') as course_level,
 (select count(*) from public.homework_assignments h where h.class_id=room.id and h.user_id=p.id and exists(select 1 from public.homework_submissions s where s.homework_id=h.id and s.user_id=p.id)) as completed,
 (select count(*) from public.homework_assignments h where h.class_id=room.id and h.user_id=p.id and not exists(select 1 from public.homework_submissions s where s.homework_id=h.id and s.user_id=p.id)) as pending
 from public.class_members m join public.profiles p on p.id=m.user_id left join public.learning_wallets w on w.user_id=p.id left join public.course_profiles cp on cp.user_id=p.id where m.class_id=room.id
 ) roster;
 select coalesce(jsonb_agg(to_jsonb(tasks) order by tasks.due_at,tasks.title,tasks.name),'[]'::jsonb) into work from (
 select h.id,h.user_id,coalesce(nullif(trim(p.full_name),''),'Learner') as name,h.title,h.due_at,s.submitted_at,
 case when s.id is not null then 'submitted' when h.due_at<current_date then 'overdue' else 'pending' end as status
 from public.homework_assignments h join public.profiles p on p.id=h.user_id left join public.homework_submissions s on s.homework_id=h.id and s.user_id=h.user_id
 where h.class_id=room.id and (room.user_id=auth.uid() or h.user_id=auth.uid())
 ) tasks;
 return jsonb_build_object('members',members,'work',work);
end $$;
create function public.delete_learning_class(class_uuid uuid) returns void language plpgsql security definer set search_path='' as $$
declare room public.learning_classes; member_ids uuid[];
begin
 select * into room from public.learning_classes where id=class_uuid and user_id=auth.uid() for update;
 if room.id is null then raise exception 'Only the class tutor can delete this class';end if;
 select array_agg(user_id) into member_ids from public.class_members where class_id=class_uuid;
 insert into public.notifications(user_id,title,body,href) select user_id,'Class closed',room.title,'/classroom' from public.class_members where class_id=class_uuid;
 delete from public.learning_classes where id=class_uuid;
 delete from public.tutor_students t where t.tutor_id=auth.uid() and t.user_id=any(member_ids)
 and not exists(select 1 from public.class_members m join public.learning_classes c on c.id=m.class_id where m.user_id=t.user_id and c.user_id=auth.uid())
 and not exists(select 1 from public.student_invitations i join public.profiles p on p.email=i.email where i.user_id=auth.uid() and p.id=t.user_id);
end $$;
create function private.notify_class_member() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.notifications(user_id,title,body,href) select user_id,'New class member',title,'/classes/'||id from public.learning_classes where id=new.class_id;
 return new;
end $$;
create trigger notify_class_member after insert on public.class_members for each row execute function private.notify_class_member();
alter table public.class_members add column last_active_at timestamptz not null default now();
create function private.class_learning_activity() returns trigger language plpgsql security definer set search_path='' as $$
begin update public.class_members set last_active_at=now() where user_id=new.user_id;return new;end $$;
create trigger class_wallet_activity after insert or update on public.learning_wallets for each row execute function private.class_learning_activity();
create function private.notify_homework_submission() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.notifications(user_id,title,body,href) select tutor_id,'Homework submitted',title,case when class_id is null then '/tutor?view=reviews' else '/classes/'||class_id end from public.homework_assignments where id=new.homework_id;
 return new;
end $$;
create trigger notify_homework_submission after insert or update on public.homework_submissions for each row execute function private.notify_homework_submission();
revoke all on function public.class_overview(uuid),public.delete_learning_class(uuid) from public;
grant execute on function public.class_overview(uuid),public.delete_learning_class(uuid) to authenticated;
-- Keep every connected screen up to date; RLS still controls each subscribed row.
do $$declare t text;begin
 foreach t in array array['learning_classes','class_members','learning_wallets','streak_inventory','homework_assignments','homework_submissions','tutor_students','tutor_feedback','tutoring_sessions','course_completions','course_profiles','course_reviews','developer_accounts'] loop
 if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then execute format('alter publication supabase_realtime add table public.%I',t);end if;
 end loop;
end $$;
-- The named developer receives access only through a verified authentication email.
create function private.sync_developer_from_auth() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if lower(new.email)='abdushynggys@mail.com' and new.email_confirmed_at is not null then
 insert into public.developer_accounts(user_id) select id from public.profiles where id=new.id on conflict do nothing;
 elsif tg_op='UPDATE' and lower(old.email)='abdushynggys@mail.com' then delete from public.developer_accounts where user_id=new.id;
 end if;
 return new;
end $$;
create trigger englishboost_z_developer after insert or update of email,email_confirmed_at on auth.users for each row execute function private.sync_developer_from_auth();
insert into public.developer_accounts(user_id) select p.id from public.profiles p join auth.users u on u.id=p.id where lower(u.email)='abdushynggys@mail.com' and u.email_confirmed_at is not null on conflict do nothing;
-- Twenty Sparks per normal tier, with one unique worldwide reward in tier eleven.
alter table public.shop_items drop constraint shop_items_tier_key;
insert into public.shop_items(id,title,tier,price,required_xp,color)
 select base.id||'-'||lpad(motif.n::text,2,'0'),base.title||' · '||motif.title,base.tier,
 case when base.tier=1 then 15+motif.n*3 else base.price+(motif.n-1)*greatest(5,base.price/20) end,base.required_xp,
 (array['#648b52','#b47a49','#548aab','#9a739e','#ad8450','#5f9592','#81855b','#8e7ca5','#b57670','#5d8299'])[1+(motif.n%10)]
 from public.shop_items base cross join (values(1,'Leaf'),(2,'Blossom'),(3,'Sun'),(4,'Moon'),(5,'Star'),(6,'Sparkle'),(7,'Feather'),(8,'Shell'),(9,'Heart'),(10,'Mountain'),(11,'Cloud'),(12,'Flame'),(13,'Droplet'),(14,'Wind'),(15,'Planet'),(16,'Lightning'),(17,'Diamond'),(18,'Crown'),(19,'Infinity')) as motif(n,title)
 where base.tier<=10;
drop policy "catalog" on public.shop_items;
create policy "unlocked spark catalog" on public.shop_items for select to authenticated using(required_xp<=coalesce((select xp from public.learning_wallets where user_id=auth.uid()),0));
