alter table public.homework_submissions enable row level security;
grant select, insert, update on public.homework_submissions to authenticated;
create policy "read homework work" on public.homework_submissions for select to authenticated
using (private.can_access(user_id));
create policy "submit own homework" on public.homework_submissions for insert to authenticated
with check (user_id = auth.uid() and private.is_approved() and exists (
  select 1 from public.homework_assignments where id = homework_id and user_id = auth.uid()
));
create policy "revise own homework" on public.homework_submissions for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid() and private.is_approved() and exists (
  select 1 from public.homework_assignments where id = homework_id and user_id = auth.uid()
));
create index on public.homework_submissions(user_id);
grant select on public.tutor_students, public.student_invitations to authenticated;

create function private.validate_feedback() returns trigger language plpgsql
set search_path = '' as $$
begin
  if new.kind = 'writing' then
    if not exists(select 1 from public.writing_submissions where id = new.submission_id and user_id = new.user_id and submitted)
      then raise exception 'Writing submission does not belong to this student'; end if;
  else
    if not exists(select 1 from public.homework_submissions where id = new.submission_id and user_id = new.user_id)
      then raise exception 'Homework submission does not belong to this student'; end if;
  end if;
  return new;
end; $$;
create trigger validate_tutor_feedback before insert or update on public.tutor_feedback
for each row execute procedure private.validate_feedback();
