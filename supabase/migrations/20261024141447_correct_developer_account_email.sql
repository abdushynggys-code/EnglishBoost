-- Correct the owner's nominated developer account; roles stay unchanged.
create or replace function private.sync_developer_from_auth() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if lower(new.email)='abdushynggys@gmail.com' and new.email_confirmed_at is not null then
 insert into public.developer_accounts(user_id) select id from public.profiles where id=new.id on conflict do nothing;
 elsif tg_op='UPDATE' and lower(old.email) in ('abdushynggys@gmail.com','abdushynggys@mail.com') then
 delete from public.developer_accounts where user_id=new.id;
 end if;
 return new;
end $$;
delete from public.developer_accounts d using auth.users u where d.user_id=u.id and lower(u.email)='abdushynggys@mail.com';
insert into public.developer_accounts(user_id) select p.id from public.profiles p join auth.users u on u.id=p.id
 where lower(u.email)='abdushynggys@gmail.com' and u.email_confirmed_at is not null on conflict do nothing;
