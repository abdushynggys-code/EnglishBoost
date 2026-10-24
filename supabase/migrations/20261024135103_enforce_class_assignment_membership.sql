create function private.check_class_homework() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.class_id is not null and not exists(select 1 from public.learning_classes c join public.class_members m on m.class_id=c.id where c.id=new.class_id and c.user_id=new.tutor_id and m.user_id=new.user_id) then raise exception 'The assignment must belong to this tutor and class member';end if;
 return new;
end $$;
create trigger check_class_homework before insert or update of class_id,tutor_id,user_id on public.homework_assignments for each row execute function private.check_class_homework();
