alter table public.course_completions add column attempts integer not null default 1 check (attempts >= 1);
create function private.count_course_attempts() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.attempts := old.attempts + 1;
  return new;
end $$;
create trigger count_course_attempts before update on public.course_completions
  for each row execute function private.count_course_attempts();
