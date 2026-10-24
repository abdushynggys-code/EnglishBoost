-- Database-owner regression checks. No fixtures survive this transaction.
begin;
insert into auth.users(id,email,raw_user_meta_data) values('0dfebd8e-cb10-4b24-8ae3-03f88d3ba2d7','quick-practice@example.invalid','{}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"0dfebd8e-cb10-4b24-8ae3-03f88d3ba2d7","role":"authenticated"}',true);
select public.save_course_placement(jsonb_build_object('level','B2','settings',jsonb_build_object('interest','everyday','daily_minutes',10),'answers',(select jsonb_agg('{}'::jsonb) from generate_series(1,20))));
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day1","score":30,"total":30}'::jsonb,'[]');
do $$begin
 if (select total from public.course_completions where lesson_id='B2-everyday-unit1-day1')<>30 then raise exception 'Quick session was not saved';end if;
 if (select xp from public.learning_wallets)<>122 then raise exception 'Quick session XP incorrect';end if;
 begin perform public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day2","score":1,"total":1}'::jsonb,'[]');raise exception 'Incomplete session accepted';exception when raise_exception then if sqlerrm<>'Complete every question' then raise;end if;end;
end $$;
-- A lesson that was already open before release can still finish at its old size.
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day2","score":20,"total":20}'::jsonb,'[]');
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day3","score":30,"total":30}'::jsonb,'[]');
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day4","score":30,"total":30}'::jsonb,'[]');
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day5","score":0,"total":0,"response":"I use clear examples when I explain a new idea. They help the reader understand my point."}'::jsonb,'[]');
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day6","score":30,"total":30}'::jsonb,'[]');
do $$begin
 begin perform public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day7","score":30,"total":30}'::jsonb,'[]');raise exception 'Wrong checkpoint size accepted';exception when raise_exception then if sqlerrm<>'Complete every question' then raise;end if;end;
end $$;
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day7","score":15,"total":20}'::jsonb,'[]');
do $$begin
 if (select passed from public.course_completions where lesson_id='B2-everyday-unit1-day7') then raise exception 'Checkpoint below 80 percent passed';end if;
 begin perform public.save_course_lesson('{"lesson_id":"B2-everyday-unit2-day1","score":30,"total":30}'::jsonb,'[]');raise exception 'Checkpoint gate bypassed';exception when raise_exception then if sqlerrm<>'Complete the previous lesson' then raise;end if;end;
end $$;
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit1-day7","score":16,"total":20}'::jsonb,'[]');
select public.save_course_lesson('{"lesson_id":"B2-everyday-unit2-day1","score":30,"total":30}'::jsonb,'[]');
do $$begin
 if not (select passed from public.course_completions where lesson_id='B2-everyday-unit1-day7') then raise exception 'Checkpoint at 80 percent failed';end if;
 if exists(select 1 from public.shop_items where required_xp>(select xp from public.learning_wallets)) then raise exception 'Locked designs exposed';end if;
 if not exists(select 1 from public.shop_items where id='seed' and title='First sprout' and price=0) then raise exception 'Owned seed identity or free price changed';end if;
end $$;
reset role;
do $$begin
 if (select count(distinct title) from public.shop_items)<>201 then raise exception 'Spark names are not unique';end if;
 if exists(select 1 from public.shop_items where title like '% · %') then raise exception 'Generic tier and motif names remain';end if;
 if not exists(select 1 from public.shop_items where id='black-hole' and title='Black hole' and required_xp=21200 and price=2200) then raise exception 'Tier ten progression incorrect';end if;
 if not exists(select 1 from public.shop_items where id='unknown' and required_xp=40000 and price=0) then raise exception 'Unknown must unlock at 40000 XP';end if;
end $$;
rollback;
