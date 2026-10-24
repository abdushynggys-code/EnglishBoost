-- Run only with a database-owner connection; every fixture is rolled back.
begin;
insert into public.tutor_accounts(email) values('platform-tutor@example.invalid');
insert into auth.users(id,email,raw_user_meta_data) values
 ('d57abbf1-255a-4dba-849d-a629d9214d71','platform-student@example.invalid','{"requested_role":"tutor"}'),
 ('252d7894-278a-4f72-88ab-8bc809450201','platform-other@example.invalid','{}'),
 ('2a79f5a4-34b3-44b3-8352-a715444c8a42','platform-tutor@example.invalid','{}');
do $$begin
 if not exists(select 1 from public.profiles where id='d57abbf1-255a-4dba-849d-a629d9214d71' and role='student' and approved) then raise exception 'Independent learning or role enforcement failed';end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"2a79f5a4-34b3-44b3-8352-a715444c8a42","role":"authenticated"}',true);
insert into public.learning_classes(id,title,code) values('46f19b04-20b2-4c42-9f3e-916a401c64ee','Test class','TESTCODE12');
select set_config('request.jwt.claims','{"sub":"d57abbf1-255a-4dba-849d-a629d9214d71","role":"authenticated"}',true);
select public.join_learning_class('testcode12');
select public.save_course_placement(jsonb_build_object('level','A1','settings',jsonb_build_object('interest','everyday','daily_minutes',10),'answers',(select jsonb_agg('{}'::jsonb) from generate_series(1,30))));
select public.save_course_lesson('{"lesson_id":"A1-everyday-unit1-day1","score":30,"total":30,"xp":99999}'::jsonb,'[]');
select public.save_course_lesson('{"lesson_id":"A1-everyday-unit1-day1","score":30,"total":30,"xp":99999}'::jsonb,'[]');
do $$begin
 if (select xp from public.learning_wallets)<>122 then raise exception 'Server XP or duplicate prevention failed';end if;
 if (select count(*) from public.reward_ledger)<>1 then raise exception 'Duplicate reward';end if;
 begin perform public.save_course_lesson('{"lesson_id":"A2-everyday-unit1-day1","score":30,"total":30}'::jsonb,'[]');raise exception 'Gate bypassed';exception when raise_exception then if sqlerrm<>'Complete the previous lesson' then raise;end if;end;
 begin perform public.purchase_streaker('black-hole');raise exception 'Tier bypassed';exception when raise_exception then if sqlerrm<>'Earn more XP to unlock this tier' then raise;end if;end;
 begin insert into public.developer_accounts(user_id) values(auth.uid());raise exception 'Self elevated';exception when insufficient_privilege then null;end;
end $$;
reset role;
insert into public.lesson_runs(id,user_id,lesson_id,started_at) values('7b15be33-3174-4e10-9c07-79f598a4aa04','d57abbf1-255a-4dba-849d-a629d9214d71','A1-everyday-unit1-day2',now()-interval '60 seconds');
set local role authenticated;
select public.save_course_lesson('{"lesson_id":"A1-everyday-unit1-day2","score":30,"total":30,"timezone":"Asia/Qyzylorda","run_id":"7b15be33-3174-4e10-9c07-79f598a4aa04"}'::jsonb,'[]');
do $$begin if (select xp from public.learning_wallets)<>254 then raise exception 'Server duration bonus failed';end if;end $$;
reset role;
insert into public.course_reviews(user_id,item_id,stage,due_at,last_reviewed_at,lapses) values
('d57abbf1-255a-4dba-849d-a629d9214d71','A1-everyday-unit1-v0',0,now()-interval '1 day',now()-interval '2 days',0),
('d57abbf1-255a-4dba-849d-a629d9214d71','A1-everyday-unit1-v1',0,now()-interval '1 day',now()-interval '2 days',0);
set local role authenticated;
select public.save_course_lesson(jsonb_build_object('lesson_id','review:'||to_char(now() at time zone 'Asia/Qyzylorda','YYYY-MM-DD'),'score',1,'total',1,'timezone','Asia/Qyzylorda'),'[{"item_id":"A1-everyday-unit1-v0","stage":1,"lapses":0}]');
select public.save_course_lesson(jsonb_build_object('lesson_id','review:'||to_char(now() at time zone 'Asia/Qyzylorda','YYYY-MM-DD'),'score',1,'total',1,'timezone','Asia/Qyzylorda'),'[{"item_id":"A1-everyday-unit1-v1","stage":1,"lapses":0}]');
do $$begin
 if (select xp from public.learning_wallets)<>326 then raise exception 'Daily review rewarded twice';end if;
 if exists(select 1 from public.course_reviews where due_at<now() or stage<>1) then raise exception 'Remaining reviews were not updated';end if;
end $$;
select public.save_course_placement(jsonb_build_object('level','A1','settings',jsonb_build_object('interest','everyday','daily_minutes',10),'answers',(select jsonb_agg('{}'::jsonb) from generate_series(1,30))));
select public.save_course_lesson('{"lesson_id":"A1-everyday-unit1-day1","score":30,"total":30}'::jsonb,'[]');
do $$begin if (select xp from public.learning_wallets)<>326 then raise exception 'Retake farmed XP';end if;
 if public.learning_rhythm('UTC')<>1 then raise exception 'Retake reset lifetime streak';end if;end $$;
select set_config('request.jwt.claims','{"sub":"2a79f5a4-34b3-44b3-8352-a715444c8a42","role":"authenticated"}',true);
select public.assign_class_work('46f19b04-20b2-4c42-9f3e-916a401c64ee','Original module','Read and practise',current_date+2,'/materials/B2/1');
do $$begin if (select count(*) from public.tutor_course_reports())<>1 then raise exception 'Tutor course reports missing';end if;end $$;
select set_config('request.jwt.claims','{"sub":"d57abbf1-255a-4dba-849d-a629d9214d71","role":"authenticated"}',true);
do $$begin if (select count(*) from public.homework_assignments)<>1 or (select count(*) from public.notifications where title='New assignment')<>1 then raise exception 'Class assignment or notification failed';end if;end $$;
select set_config('request.jwt.claims','{"sub":"252d7894-278a-4f72-88ab-8bc809450201","role":"authenticated"}',true);
do $$begin if (select count(*) from public.homework_assignments)<>0 or (select count(*) from public.learning_wallets)<>0 or (select count(*) from public.notifications)<>0 or (select count(*) from public.learning_classes)<>0 then raise exception 'Own-row RLS failed';end if;end $$;
reset role;
insert into public.learning_wallets(user_id,xp,coins) values('252d7894-278a-4f72-88ab-8bc809450201',70000,10000) on conflict(user_id) do update set xp=70000,coins=10000;
update public.learning_wallets set xp=70000,coins=10000 where user_id='d57abbf1-255a-4dba-849d-a629d9214d71';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"d57abbf1-255a-4dba-849d-a629d9214d71","role":"authenticated"}',true);
select public.purchase_streaker('black-hole');select public.purchase_streaker('black-hole');select public.purchase_streaker('unknown');
do $$begin if (select coins from public.learning_wallets)<>6000 then raise exception 'Purchase charged twice';end if;end $$;
select set_config('request.jwt.claims','{"sub":"252d7894-278a-4f72-88ab-8bc809450201","role":"authenticated"}',true);
do $$begin begin perform public.purchase_streaker('unknown');raise exception 'Second worldwide claim';exception when raise_exception then if sqlerrm<>'The worldwide item has already been claimed' then raise;end if;end;end $$;
rollback;
