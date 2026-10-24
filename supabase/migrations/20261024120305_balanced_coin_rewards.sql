-- Keep top-tier prices attainable near their XP thresholds.
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
 awarded:=new.xp+bonus;earned_coins:=greatest(1,awarded/10)+least(5,streak/3);
 insert into public.reward_ledger(user_id,event_key,xp,coins) values(new.user_id,new.lesson_id,awarded,earned_coins) on conflict do nothing;
 if not found then return new;end if;
 insert into public.learning_wallets(user_id,xp,coins) values(new.user_id,awarded,earned_coins) on conflict(user_id) do update set xp=public.learning_wallets.xp+excluded.xp,coins=public.learning_wallets.coins+excluded.coins,updated_at=now();
 return new;
end $$;
