-- Written-only reading activities are saved without inventing an automatic score.
do $$ declare constraint_name text; begin
  for constraint_name in select conname from pg_constraint
    where conrelid = 'public.reading_attempts'::regclass and contype = 'c'
    and pg_get_constraintdef(oid) like '%total > 0%'
  loop
    execute format('alter table public.reading_attempts drop constraint %I', constraint_name);
  end loop;
end $$;
alter table public.reading_attempts add constraint reading_total_nonnegative check(total >= 0);
