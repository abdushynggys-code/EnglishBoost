alter table public.course_completions add column learner_timezone text not null default 'UTC';
create or replace function public.save_course_lesson(completion jsonb,review_cards jsonb) returns void language plpgsql security definer set search_path='' as $$
declare learner uuid:=auth.uid();lesson text:=completion->>'lesson_id';placement jsonb;earned integer;did_pass boolean;result_score integer:=(completion->>'score')::integer;result_total integer:=(completion->>'total')::integer;unit_number integer;day_number integer;previous_lesson text;prefix text;card jsonb;due timestamptz;new_stage integer;old_card public.course_reviews;level_index integer;start_index integer;levels text[]:=array['A1','A2','B1','B2','C1','C2']; interest text;
begin
 if learner is null or not private.is_approved() then raise exception 'Sign in first';end if;
 perform pg_advisory_xact_lock(hashtext(learner::text));
 select p.placement into placement from public.course_profiles p where user_id=learner;
 if placement is null then raise exception 'Complete your level check first';end if;
 if result_total is null or result_score is null or result_total not between 0 and 30 or result_score not between 0 and result_total or jsonb_typeof(review_cards) is distinct from 'array' or jsonb_array_length(review_cards)>30 then raise exception 'Invalid lesson result';end if;
 interest:=placement#>>'{settings,interest}';start_index:=array_position(levels,placement->>'level');
 if lesson ~ '^(review|challenge):[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
 if not exists(select 1 from pg_catalog.pg_timezone_names where name=completion->>'timezone') or right(lesson,10)<>to_char(now() at time zone(completion->>'timezone'),'YYYY-MM-DD') then raise exception 'Invalid practice date';end if;
 if lesson like 'review:%' then
 if not exists(select 1 from public.course_reviews where user_id=learner and due_at<=now()) or result_total=0 then raise exception 'No reviews due';end if;
 earned:=50;did_pass:=true;
 else
 if not exists(select 1 from public.course_completions where user_id=learner and lesson_id='C2-'||interest||'-unit4-day7' and passed) or result_total<>15 then raise exception 'Finish the path before the daily challenge';end if;
 did_pass:=result_score::numeric/result_total>=0.8;earned:=case when did_pass then 150 else 0 end;
 end if;
 else
 if lesson !~ '^(A1|A2|B1|B2|C1|C2)-(everyday|travel|stories|school)-unit[1-4]-day[1-7]$' then raise exception 'Invalid lesson';end if;
 level_index:=array_position(levels,split_part(lesson,'-',1));
 if level_index<start_index or split_part(lesson,'-',2)<>interest then raise exception 'Lesson does not belong to your path';end if;
 prefix:=levels[level_index]||'-'||interest||'-';unit_number:=substring(lesson from 'unit([1-4])')::integer;day_number:=right(lesson,1)::integer;
 if day_number>1 or unit_number>1 then previous_lesson:=prefix||'unit'||(case when day_number=1 then unit_number-1 else unit_number end)||'-day'||(case when day_number=1 then 7 else day_number-1 end);
 elsif level_index>start_index then previous_lesson:=levels[level_index-1]||'-'||interest||'-unit4-day7';end if;
 if previous_lesson is not null and not exists(select 1 from public.course_completions where user_id=learner and lesson_id=previous_lesson and passed) then raise exception 'Complete the previous lesson';end if;
 if day_number<>5 and result_total<>(case when level_index<=2 then 30 when level_index<=4 then 20 else 15 end) then raise exception 'Complete every question';end if;
 if day_number=5 and (length(trim(coalesce(completion->>'response','')))<10 or result_total<>0) then raise exception 'Complete the writing task';end if;
 did_pass:=day_number<>7 or (result_total>=15 and result_score::numeric/result_total>=0.8);earned:=case when not did_pass then 0 when day_number=7 then 250 else 100 end;
 end if;
 if exists(select 1 from public.course_completions where user_id=learner and lesson_id=lesson and passed) and lesson not like 'review:%' then return;end if;
 if completion->>'run_id' is not null then update public.lesson_runs set finished=true where id=(completion->>'run_id')::uuid and user_id=learner and lesson_id=lesson;end if;
 insert into public.course_completions(user_id,lesson_id,score,total,xp,passed,response,learner_timezone) values(learner,lesson,result_score,result_total,earned,did_pass,coalesce(completion->>'response',''),case when exists(select 1 from pg_catalog.pg_timezone_names where name=completion->>'timezone') then completion->>'timezone' else 'UTC' end) on conflict(user_id,lesson_id) do update set score=excluded.score,total=excluded.total,xp=excluded.xp,passed=excluded.passed,response=excluded.response,completed_at=now() where not public.course_completions.passed;
 for card in select * from jsonb_array_elements(review_cards) loop
 if card->>'item_id' is null or card->>'item_id' !~ '^(A1|A2|B1|B2|C1|C2)-' or length(card->>'item_id')>160 then raise exception 'Invalid review item';end if;
 select * into old_card from public.course_reviews where user_id=learner and item_id=card->>'item_id';
 if old_card.item_id is not null and old_card.due_at>now() then continue;end if;
 new_stage:=least(4,greatest(0,(card->>'stage')::integer));due:=now()+make_interval(days=>(array[1,3,7,14,28])[new_stage+1]);
 insert into public.course_reviews(user_id,item_id,stage,due_at,last_reviewed_at,lapses) values(learner,card->>'item_id',new_stage,due,now(),greatest(0,(card->>'lapses')::integer)) on conflict(user_id,item_id) do update set stage=excluded.stage,due_at=excluded.due_at,last_reviewed_at=excluded.last_reviewed_at,lapses=excluded.lapses;
 end loop;
end $$;

create or replace function private.reward_learning() returns trigger language plpgsql security definer set search_path='' as $$
declare streak integer:=0; earned_coins integer; bonus integer; awarded integer; marker date:=current_date; exists_day boolean;
begin
 if not new.passed or (tg_op='UPDATE' and old.passed) then return new; end if;
 perform pg_advisory_xact_lock(hashtext(new.user_id::text));
 marker:=(now() at time zone new.learner_timezone)::date;
 if not exists(select 1 from public.reward_ledger where user_id=new.user_id and (created_at at time zone new.learner_timezone)::date=marker) then marker:=marker-1;streak:=1;end if;
 loop
 select exists(select 1 from public.reward_ledger where user_id=new.user_id and (created_at at time zone new.learner_timezone)::date=marker) into exists_day;
 exit when not exists_day or streak>=20;
 streak:=streak+1;marker:=marker-1;
 end loop;
 bonus:=least(20,streak*2)+case when new.total>0 and new.score=new.total then 20 else 0 end;
 if exists(select 1 from public.lesson_runs where user_id=new.user_id and lesson_id=new.lesson_id and finished and started_at between now()-interval '3 minutes' and now()-interval '45 seconds') then bonus:=bonus+10;end if;
 awarded:=new.xp+bonus;earned_coins:=greatest(1,awarded/100)+least(5,streak/3);
 insert into public.reward_ledger(user_id,event_key,xp,coins) values(new.user_id,new.lesson_id,awarded,earned_coins) on conflict do nothing;
 if not found then return new;end if;
 insert into public.learning_wallets(user_id,xp,coins) values(new.user_id,awarded,earned_coins) on conflict(user_id) do update set xp=public.learning_wallets.xp+excluded.xp,coins=public.learning_wallets.coins+excluded.coins,updated_at=now();
 return new;
end $$;

create function private.notify_feedback() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.notifications(user_id,title,body,href) values(new.user_id,'Feedback received',left(new.comment,500),case when new.kind='homework' then '/homework' else '/writing' end);return new;end $$;
create trigger notify_feedback after insert on public.tutor_feedback for each row execute procedure private.notify_feedback();
create function private.notify_session() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.notifications(user_id,title,body,href) values(new.user_id,'Session scheduled','Your tutor has scheduled a session.','/homework');return new;end $$;
create trigger notify_session after insert on public.tutoring_sessions for each row execute procedure private.notify_session();
do $$begin if exists(select 1 from pg_publication where pubname='supabase_realtime') then alter publication supabase_realtime add table public.notifications;end if;end $$;
