create table public.learning_wallets(user_id uuid primary key default auth.uid() references public.profiles on delete cascade,xp bigint not null default 0 check(xp>=0),coins bigint not null default 0 check(coins>=0),equipped text not null default 'seed',updated_at timestamptz not null default now());
create table public.reward_ledger(user_id uuid not null references public.profiles on delete cascade,event_key text not null,xp integer not null,coins integer not null,created_at timestamptz not null default now(),primary key(user_id,event_key));
create table public.streak_inventory(user_id uuid not null references public.profiles on delete cascade,item_id text not null,created_at timestamptz not null default now(),primary key(user_id,item_id));
create table public.lesson_runs(id uuid primary key default gen_random_uuid(),user_id uuid not null default auth.uid() references public.profiles on delete cascade,lesson_id text not null,started_at timestamptz not null default now(),finished boolean not null default false);
create table public.shop_items(id text primary key,title text not null,tier integer not null unique check(tier between 1 and 11),price integer not null,required_xp integer not null,color text not null);
create table public.world_trophy(id integer primary key check(id=1),user_id uuid unique references public.profiles on delete set null,claimed_at timestamptz);
insert into public.world_trophy(id) values(1);
insert into public.shop_items values
 ('seed','Seed',1,0,0,'#6a975c'),('fire','Fire',2,75,416,'#e09238'),('wave','Wave',3,150,1221,'#428ac0'),('comet','Comet',4,300,2541,'#8b73c4'),('bloom','Bloom',5,500,4556,'#c57393'),('orbit','Orbit',6,800,7301,'#619b9f'),('aurora','Aurora',7,1200,11661,'#58a68f'),('storm','Storm',8,1800,18236,'#7c83bd'),('supernova','Supernova',9,2600,26061,'#c38a48'),('black-hole','Black hole',10,4000,37101,'#8c6cd0'),('unknown','Unknown',11,0,70000,'#b5ad83');
alter table public.learning_wallets enable row level security;
alter table public.reward_ledger enable row level security;
alter table public.streak_inventory enable row level security;
alter table public.lesson_runs enable row level security;
alter table public.shop_items enable row level security;
alter table public.world_trophy enable row level security;
create policy "own wallet" on public.learning_wallets for select to authenticated using(auth.uid()=user_id);
create policy "own rewards" on public.reward_ledger for select to authenticated using(auth.uid()=user_id);
create policy "own streakers" on public.streak_inventory for select to authenticated using(auth.uid()=user_id);
create policy "own runs" on public.lesson_runs for select to authenticated using(auth.uid()=user_id);
create policy "catalog" on public.shop_items for select to authenticated using(true);
create policy "own trophy" on public.world_trophy for select to authenticated using(auth.uid()=user_id);
grant select on public.learning_wallets,public.reward_ledger,public.streak_inventory,public.lesson_runs,public.shop_items,public.world_trophy to authenticated;
insert into public.learning_wallets(user_id,xp,coins) select user_id,sum(xp),sum(xp)/100 from public.course_completions where passed group by user_id;
create function public.begin_lesson(lesson text) returns uuid language plpgsql security definer set search_path='' as $$
declare run uuid;
begin
 if auth.uid() is null or length(lesson)>120 then raise exception 'Sign in first'; end if;
 insert into public.lesson_runs(user_id,lesson_id) values(auth.uid(),lesson) returning id into run; return run;
end $$;
create function private.reward_learning() returns trigger language plpgsql security definer set search_path='' as $$
declare streak integer:=0; earned_coins integer; bonus integer; awarded integer; marker date:=current_date; exists_day boolean;
begin
 if not new.passed or (tg_op='UPDATE' and old.passed) then return new; end if;
 perform pg_advisory_xact_lock(hashtext(new.user_id::text));
 loop
 select exists(select 1 from public.reward_ledger where user_id=new.user_id and created_at::date=marker) into exists_day;
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
create trigger reward_course_completion after insert or update on public.course_completions for each row execute procedure private.reward_learning();
create function public.purchase_streaker(item text) returns void language plpgsql security definer set search_path='' as $$
declare product public.shop_items;wallet public.learning_wallets;
begin
 if auth.uid() is null then raise exception 'Sign in first';end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 insert into public.learning_wallets(user_id) values(auth.uid()) on conflict do nothing;
 select * into product from public.shop_items where id=item;
 select * into wallet from public.learning_wallets where user_id=auth.uid() for update;
 if product.id is null then raise exception 'Item not found';end if;
 if wallet.xp<product.required_xp then raise exception 'Earn more XP to unlock this tier';end if;
 if exists(select 1 from public.streak_inventory where user_id=auth.uid() and item_id=item) or item='seed' then
 update public.learning_wallets set equipped=item where user_id=auth.uid();return;end if;
 if wallet.coins<product.price then raise exception 'Not enough coins';end if;
 if product.tier=11 then
 update public.world_trophy set user_id=auth.uid(),claimed_at=now() where id=1 and claimed_at is null;
 if not found then raise exception 'The worldwide item has already been claimed';end if;
 end if;
 update public.learning_wallets set coins=coins-product.price,equipped=item where user_id=auth.uid();
 insert into public.streak_inventory(user_id,item_id) values(auth.uid(),item);
end $$;
revoke all on function public.begin_lesson(text),public.purchase_streaker(text) from public;
grant execute on function public.begin_lesson(text),public.purchase_streaker(text) to authenticated;
