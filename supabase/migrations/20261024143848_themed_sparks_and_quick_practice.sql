-- Rename existing items in place: purchases, equipped Sparks and prices are preserved.
update public.shop_items item set title=design.title,color=design.color from (values
('seed','First sprout','hsl(92 40% 42%)'), ('seed-01','Dew leaf','hsl(96 44% 45%)'), ('seed-02','Lucky clover','hsl(100 48% 48%)'), ('seed-03','Meadow daisy','hsl(104 40% 51%)'),
('seed-04','Wild blossom','hsl(108 44% 42%)'), ('seed-05','Alpine pine','hsl(92 48% 45%)'), ('seed-06','Old oak','hsl(96 40% 48%)'), ('seed-07','Quiet grove','hsl(100 44% 51%)'),
('seed-08','Golden wheat','hsl(104 48% 42%)'), ('seed-09','Orchard apple','hsl(108 40% 45%)'), ('seed-10','Twin cherries','hsl(92 44% 48%)'), ('seed-11','Lemon zest','hsl(96 48% 51%)'),
('seed-12','Vineyard grape','hsl(100 40% 42%)'), ('seed-13','Garden carrot','hsl(104 44% 45%)'), ('seed-14','Runner bean','hsl(108 48% 48%)'), ('seed-15','Hazel nut','hsl(92 40% 51%)'),
('seed-16','Sunlit banana','hsl(96 44% 42%)'), ('seed-17','Fresh harvest','hsl(100 48% 45%)'), ('seed-18','Green promise','hsl(104 40% 48%)'), ('seed-19','Hops vine','hsl(108 44% 51%)'),
('fire','First flame','hsl(22 40% 42%)'), ('fire-01','Fire guardian','hsl(26 44% 45%)'), ('fire-02','Winter warmer','hsl(30 48% 48%)'), ('fire-03','Campfire pot','hsl(34 40% 51%)'),
('fire-04','Comfort bowl','hsl(38 44% 42%)'), ('fire-05','Morning coffee','hsl(22 48% 45%)'), ('fire-06','Summer fizz','hsl(26 40% 48%)'), ('fire-07','Midnight microwave','hsl(30 44% 51%)'),
('fire-08','Dinner invitation','hsl(34 48% 42%)'), ('fire-09','Golden croissant','hsl(38 40% 45%)'), ('fire-10','Pizza party','hsl(22 44% 48%)'), ('fire-11','Picnic sandwich','hsl(26 48% 51%)'),
('fire-12','Lucky cookie','hsl(30 40% 42%)'), ('fire-13','Birthday slice','hsl(34 44% 45%)'), ('fire-14','Cinema popcorn','hsl(38 48% 48%)'), ('fire-15','Sunny-side up','hsl(22 40% 51%)'),
('fire-16','Roast feast','hsl(26 44% 42%)'), ('fire-17','Chef of the day','hsl(30 48% 45%)'), ('fire-18','Steak night','hsl(34 40% 48%)'), ('fire-19','Milk bottle','hsl(38 44% 51%)'),
('wave','Rolling tide','hsl(192 40% 42%)'), ('wave-01','Pearl shell','hsl(196 44% 45%)'), ('wave-02','Silver fish','hsl(200 48% 48%)'), ('wave-03','Reef turtle','hsl(204 40% 51%)'),
('wave-04','Sea snail','hsl(208 44% 42%)'), ('wave-05','Cargo captain','hsl(192 48% 45%)'), ('wave-06','Harbour anchor','hsl(196 40% 48%)'), ('wave-07','True north','hsl(200 44% 51%)'),
('wave-08','Regatta sail','hsl(204 48% 42%)'), ('wave-09','Rescue ring','hsl(208 40% 45%)'), ('wave-10','Coastal chart','hsl(192 44% 48%)'), ('wave-11','Headland arrow','hsl(196 48% 51%)'),
('wave-12','Island palm','hsl(200 40% 42%)'), ('wave-13','Sandcastle spade','hsl(204 44% 45%)'), ('wave-14','Tide watcher','hsl(208 48% 48%)'), ('wave-15','Shore tracks','hsl(192 40% 51%)'),
('wave-16','Message in a bottle','hsl(196 44% 42%)'), ('wave-17','Dockside cargo','hsl(200 48% 45%)'), ('wave-18','Pier wheel','hsl(204 40% 48%)'), ('wave-19','Beach umbrella','hsl(208 44% 51%)'),
('comet','Trail bike','hsl(152 40% 42%)'), ('comet-01','City explorer','hsl(156 44% 45%)'), ('comet-02','Road trip','hsl(160 48% 48%)'), ('comet-03','Night express','hsl(164 40% 51%)'),
('comet-04','Old-town tram','hsl(168 44% 42%)'), ('comet-05','Summit cable car','hsl(152 48% 45%)'), ('comet-06','Cloudliner','hsl(156 40% 48%)'), ('comet-07','Rescue helicopter','hsl(160 44% 51%)'),
('comet-08','Launch day','hsl(164 48% 42%)'), ('comet-09','Adventure pack','hsl(168 40% 45%)'), ('comet-10','World traveller','hsl(152 44% 48%)'), ('comet-11','Golden ticket','hsl(156 48% 51%)'),
('comet-12','Mountain summit','hsl(160 40% 42%)'), ('comet-13','Base camp','hsl(164 44% 45%)'), ('comet-14','Crossroads','hsl(168 48% 48%)'), ('comet-15','Finish flag','hsl(152 40% 51%)'),
('comet-16','Scenic route','hsl(156 44% 42%)'), ('comet-17','Room to roam','hsl(160 48% 45%)'), ('comet-18','Travel camera','hsl(164 40% 48%)'), ('comet-19','You are here','hsl(168 44% 51%)'),
('bloom','Player one','hsl(257 40% 42%)'), ('bloom-01','High-score joystick','hsl(261 44% 45%)'), ('bloom-02','Lucky five','hsl(265 48% 48%)'), ('bloom-03','Puzzle piece','hsl(269 40% 51%)'),
('bloom-04','Knight move','hsl(273 44% 42%)'), ('bloom-05','Castle rook','hsl(257 48% 45%)'), ('bloom-06','Bishop diagonal','hsl(261 40% 48%)'), ('bloom-07','Brave pawn','hsl(265 44% 51%)'),
('bloom-08','Beach volley','hsl(269 48% 42%)'), ('bloom-09','Match winner','hsl(273 40% 45%)'), ('bloom-10','Champion cup','hsl(257 44% 48%)'), ('bloom-11','Victory medal','hsl(261 48% 51%)'),
('bloom-12','Bullseye','hsl(265 40% 42%)'), ('bloom-13','Ace of spades','hsl(269 44% 45%)'), ('bloom-14','Lucky club','hsl(273 48% 48%)'), ('bloom-15','Extra life','hsl(257 40% 51%)'),
('bloom-16','Diamond deal','hsl(261 44% 42%)'), ('bloom-17','Power lift','hsl(265 48% 45%)'), ('bloom-18','Rugby rush','hsl(269 40% 48%)'), ('bloom-19','Checkmate king','hsl(273 44% 51%)'),
('orbit','Clockwork gear','hsl(202 40% 42%)'), ('orbit-01','Fix-it wrench','hsl(206 44% 45%)'), ('orbit-02','Builder hammer','hsl(210 48% 48%)'), ('orbit-03','Power drill','hsl(214 40% 51%)'),
('orbit-04','Blacksmith anvil','hsl(218 44% 42%)'), ('orbit-05','Deep miner','hsl(202 48% 45%)'), ('orbit-06','Timber axe','hsl(206 40% 48%)'), ('orbit-07','Perfect measure','hsl(210 44% 51%)'),
('orbit-08','Clean cut','hsl(214 48% 42%)'), ('orbit-09','Colour maker','hsl(218 40% 45%)'), ('orbit-10','Fresh coat','hsl(202 44% 48%)'), ('orbit-11','Design desk','hsl(206 48% 51%)'),
('orbit-12','Precision compass','hsl(210 40% 42%)'), ('orbit-13','Circuit explorer','hsl(214 44% 45%)'), ('orbit-14','Thinking chip','hsl(218 48% 48%)'), ('orbit-15','Friendly robot','hsl(202 40% 51%)'),
('orbit-16','Bright idea','hsl(206 44% 42%)'), ('orbit-17','Magnetic pull','hsl(210 48% 45%)'), ('orbit-18','Full charge','hsl(214 40% 48%)'), ('orbit-19','Small discoveries','hsl(218 44% 51%)'),
('aurora','Soundwave','hsl(337 40% 42%)'), ('aurora-01','Drum solo','hsl(341 44% 45%)'), ('aurora-02','Acoustic evening','hsl(345 48% 48%)'), ('aurora-03','Grand piano','hsl(349 40% 51%)'),
('aurora-04','Bass speaker','hsl(353 44% 42%)'), ('aurora-05','Private concert','hsl(337 48% 45%)'), ('aurora-06','Open mic','hsl(341 40% 48%)'), ('aurora-07','Radio days','hsl(345 44% 51%)'),
('aurora-08','Vinyl groove','hsl(349 48% 42%)'), ('aurora-09','Mixtape','hsl(353 40% 45%)'), ('aurora-10','Opening bell','hsl(337 44% 48%)'), ('aurora-11','Wake-up call','hsl(341 48% 51%)'),
('aurora-12','Director cut','hsl(345 40% 42%)'), ('aurora-13','Film reel','hsl(349 44% 45%)'), ('aurora-14','Action camera','hsl(353 48% 48%)'), ('aurora-15','Centre stage','hsl(337 40% 51%)'),
('aurora-16','Artist palette','hsl(341 44% 42%)'), ('aurora-17','Ink brush','hsl(345 48% 45%)'), ('aurora-18','Clay amphora','hsl(349 40% 48%)'), ('aurora-19','Paper crane','hsl(353 44% 51%)'),
('storm','Citadel','hsl(272 40% 43%)'), ('storm-01','Sovereign crown','hsl(276 44% 43%)'), ('storm-02','Ancient key','hsl(280 48% 43%)'), ('storm-03','Oath shield','hsl(284 40% 43%)'),
('storm-04','Dawn blade','hsl(288 44% 43%)'), ('storm-05','Wonder wand','hsl(272 48% 43%)'), ('storm-06','Forgotten scroll','hsl(276 40% 43%)'), ('storm-07','Spellbook','hsl(280 44% 43%)'),
('storm-08','Prismatic gem','hsl(284 48% 43%)'), ('storm-09','Crystal skull','hsl(288 40% 43%)'), ('storm-10','Alchemy flask','hsl(272 44% 43%)'), ('storm-11','Sands of time','hsl(276 48% 43%)'),
('storm-12','Friendly ghost','hsl(280 40% 43%)'), ('storm-13','Oracle eye','hsl(284 44% 43%)'), ('storm-14','Hidden doorway','hsl(288 48% 43%)'), ('storm-15','Midnight familiar','hsl(272 40% 43%)'),
('storm-16','Wild sigil','hsl(276 44% 43%)'), ('storm-17','Frost kingdom','hsl(280 48% 43%)'), ('storm-18','Runic queen','hsl(284 40% 43%)'), ('storm-19','Secret identity','hsl(288 44% 43%)'),
('supernova','Supernova','hsl(32 40% 43%)'), ('supernova-01','Solar heart','hsl(36 44% 43%)'), ('supernova-02','North star','hsl(40 48% 43%)'), ('supernova-03','Crescent moon','hsl(44 40% 43%)'),
('supernova-04','First light','hsl(48 44% 43%)'), ('supernova-05','Last light','hsl(32 48% 43%)'), ('supernova-06','Total eclipse','hsl(36 40% 43%)'), ('supernova-07','Planetary orbit','hsl(40 44% 43%)'),
('supernova-08','Atomic dance','hsl(44 48% 43%)'), ('supernova-09','Deep-space satellite','hsl(48 40% 43%)'), ('supernova-10','Listening dish','hsl(32 44% 43%)'), ('supernova-11','Stargazer','hsl(36 48% 43%)'),
('supernova-12','Blue planet','hsl(40 40% 43%)'), ('supernova-13','Stellar symmetry','hsl(44 44% 43%)'), ('supernova-14','Boundless sky','hsl(48 48% 43%)'), ('supernova-15','Comet tail','hsl(32 40% 43%)'),
('supernova-16','Asteroid belt','hsl(36 44% 43%)'), ('supernova-17','Rose nebula','hsl(40 48% 43%)'), ('supernova-18','Spiral galaxy','hsl(44 40% 43%)'), ('supernova-19','Pulsar beacon','hsl(48 44% 43%)'),
('black-hole','Black hole','hsl(247 40% 43%)'), ('black-hole-01','Einstein ring','hsl(251 44% 43%)'), ('black-hole-02','Wormhole','hsl(255 48% 43%)'), ('black-hole-03','Gravity well','hsl(259 40% 43%)'),
('black-hole-04','Twin singularity','hsl(263 44% 43%)'), ('black-hole-05','Polar jet','hsl(247 48% 43%)'), ('black-hole-06','Photon sphere','hsl(251 40% 43%)'), ('black-hole-07','Tidal stream','hsl(255 44% 43%)'),
('black-hole-08','Event horizon','hsl(259 48% 43%)'), ('black-hole-09','Spacetime fold','hsl(263 40% 43%)'), ('black-hole-10','Accretion spiral','hsl(247 44% 43%)'), ('black-hole-11','Quantum knot','hsl(251 48% 43%)'),
('black-hole-12','Dark matter lattice','hsl(255 40% 43%)'), ('black-hole-13','Magnetar','hsl(259 44% 43%)'), ('black-hole-14','Cosmic string','hsl(263 48% 43%)'), ('black-hole-15','Time dilation','hsl(247 40% 43%)'),
('black-hole-16','Gravitational wave','hsl(251 44% 43%)'), ('black-hole-17','Neutron merger','hsl(255 48% 43%)'), ('black-hole-18','Causal diamond','hsl(259 40% 43%)'), ('black-hole-19','Hawking glow','hsl(263 44% 43%)'),
('unknown','The Unrepeatable','hsl(40 32% 43%)')
) as design(id,title,color) where item.id=design.id;

-- Quick daily practice uses thirty short items; assessments retain their level-specific counts.
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
 if day_number=7 and result_total<>(case when level_index<=2 then 30 when level_index<=4 then 20 else 15 end) then raise exception 'Complete every question';end if;
 -- Retain the previous session sizes so already-open lessons can finish safely.
 if day_number not in (5,7) and result_total not in (30,case when level_index<=2 then 30 when level_index<=4 then 20 else 15 end) then raise exception 'Complete every question';end if;
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
