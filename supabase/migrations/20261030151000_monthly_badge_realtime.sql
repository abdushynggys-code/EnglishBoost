do $$ begin
  if exists(select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists(
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'class_monthly_badges'
    ) then
    alter publication supabase_realtime add table public.class_monthly_badges;
  end if;
end $$;
