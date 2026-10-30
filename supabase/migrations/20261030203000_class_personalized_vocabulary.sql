alter table public.vocabulary
  add column class_id uuid references public.learning_classes on delete cascade,
  add column student_id uuid references public.profiles on delete cascade,
  add column source text not null default 'manual' check(source in ('manual','extracted','support'));

create index vocabulary_class_student on public.vocabulary(class_id, student_id, word);

drop policy "read learning content" on public.vocabulary;
create policy "read scoped vocabulary" on public.vocabulary for select to authenticated using (
  private.is_approved() and (
    user_id is null
    or user_id = auth.uid()
    or exists(
      select 1 from public.tutor_students t
      where t.tutor_id = vocabulary.user_id and t.user_id = auth.uid()
        and (vocabulary.student_id is null or vocabulary.student_id = auth.uid())
        and (vocabulary.class_id is null or exists(
          select 1 from public.class_members m
          where m.class_id = vocabulary.class_id and m.user_id = auth.uid()
        ))
    )
  )
);

create function public.personalize_student_course_v2(
  class_uuid uuid,
  student_uuid uuid,
  course_plan jsonb,
  vocabulary_items jsonb,
  work_title text,
  work_instructions text,
  due_date date,
  practice text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  assignment_id uuid;
  item jsonb;
  item_word text;
begin
  if jsonb_typeof(vocabulary_items) is distinct from 'array'
    or jsonb_array_length(vocabulary_items) not between 1 and 20 then
    raise exception 'Invalid vocabulary list';
  end if;

  assignment_id := public.personalize_student_course(
    class_uuid, student_uuid, course_plan, work_title, work_instructions, due_date, practice
  );

  for item in select * from jsonb_array_elements(vocabulary_items) loop
    item_word := trim(item->>'word');
    if length(item_word) not between 1 and 80
      or length(coalesce(item->>'definition','')) not between 2 and 500
      or length(coalesce(item->>'example','')) not between 2 and 500
      or length(coalesce(item->>'translation_de','')) not between 1 and 200
      or length(coalesce(item->>'translation_ru','')) not between 1 and 200
      or length(coalesce(item->>'translation_kk','')) not between 1 and 200
      or item->>'source' not in ('extracted','support') then
      raise exception 'Invalid vocabulary item';
    end if;
    if not exists(
      select 1 from public.vocabulary v
      where v.class_id = class_uuid and v.student_id = student_uuid and lower(v.word) = lower(item_word)
    ) then
      insert into public.vocabulary(
        id, user_id, class_id, student_id, source, word, translation, translation_ru, translation_kk,
        definition, example, theme, difficulty
      ) values (
        'ai-vocab-' || gen_random_uuid()::text, auth.uid(), class_uuid, student_uuid, item->>'source', item_word,
        item->>'translation_de', item->>'translation_ru', item->>'translation_kk', item->>'definition',
        item->>'example', 'Class assignment', course_plan->>'level'
      );
    end if;
  end loop;
  return assignment_id;
end
$$;

revoke all on function public.personalize_student_course_v2(uuid,uuid,jsonb,jsonb,text,text,date,text) from public, anon;
grant execute on function public.personalize_student_course_v2(uuid,uuid,jsonb,jsonb,text,text,date,text) to authenticated;

create function public.assign_group_work(
  class_uuid uuid,
  student_uuids uuid[],
  work_title text,
  work_instructions text,
  due_date date,
  practice text default '/course'
) returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  student_uuid uuid;
  assigned integer := 0;
begin
  if not private.is_tutor() or not exists(
    select 1 from public.learning_classes where id = class_uuid and user_id = auth.uid()
  ) then raise exception 'Tutor access required'; end if;
  if coalesce(array_length(student_uuids, 1), 0) not between 1 and 100
    or length(trim(work_title)) not between 2 and 160 or length(work_instructions) > 5000
    or due_date < current_date or practice not like '/%' or practice like '//%' then
    raise exception 'Invalid assignment';
  end if;
  foreach student_uuid in array student_uuids loop
    if not exists(select 1 from public.class_members where class_id = class_uuid and user_id = student_uuid) then
      raise exception 'Every selected learner must belong to this class';
    end if;
    insert into public.homework_assignments(user_id,tutor_id,title,instructions,due_at,practice_path,class_id)
    values(student_uuid,auth.uid(),trim(work_title),work_instructions,due_date,practice,class_uuid);
    assigned := assigned + 1;
  end loop;
  return assigned;
end
$$;

revoke all on function public.assign_group_work(uuid,uuid[],text,text,date,text) from public, anon;
grant execute on function public.assign_group_work(uuid,uuid[],text,text,date,text) to authenticated;

-- Give the classroom workspace the learner's current course evidence and editable task details.
create or replace function public.class_overview(class_uuid uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare room public.learning_classes; members jsonb; work jsonb;
begin
  select * into room from public.learning_classes
  where id = class_uuid and (user_id = auth.uid() or private.in_class(id));
  if room.id is null then raise exception 'Class not found or access denied'; end if;

  select coalesce(jsonb_agg(to_jsonb(roster) order by roster.xp desc, roster.name, roster.user_id), '[]'::jsonb)
  into members from (
    select p.id as user_id, coalesce(nullif(trim(p.full_name), ''), 'Learner') as name,
      coalesce(w.xp, 0) as xp, coalesce(cp.placement->>'level', '') as course_level,
      cp.placement->'skill_levels' as skill_levels,
      cp.placement#>>'{settings,interest}' as course_interest,
      cp.placement#>>'{personalization,summary}' as personalization_summary,
      (select count(*) from public.homework_assignments h where h.class_id = room.id and h.user_id = p.id
        and exists(select 1 from public.homework_submissions s where s.homework_id = h.id and s.user_id = p.id)) as completed,
      (select count(*) from public.homework_assignments h where h.class_id = room.id and h.user_id = p.id
        and not exists(select 1 from public.homework_submissions s where s.homework_id = h.id and s.user_id = p.id)) as pending
    from public.class_members m
    join public.profiles p on p.id = m.user_id
    left join public.learning_wallets w on w.user_id = p.id
    left join public.course_profiles cp on cp.user_id = p.id
    where m.class_id = room.id
  ) roster;

  select coalesce(jsonb_agg(to_jsonb(tasks) order by tasks.due_at, tasks.title, tasks.name), '[]'::jsonb)
  into work from (
    select h.id, h.user_id, coalesce(nullif(trim(p.full_name), ''), 'Learner') as name,
      h.title, h.instructions, h.practice_path, h.due_at, s.submitted_at,
      case when s.id is not null then 'submitted' when h.due_at < current_date then 'overdue' else 'pending' end as status
    from public.homework_assignments h
    join public.profiles p on p.id = h.user_id
    left join public.homework_submissions s on s.homework_id = h.id and s.user_id = h.user_id
    where h.class_id = room.id and (room.user_id = auth.uid() or h.user_id = auth.uid())
  ) tasks;
  return jsonb_build_object('members', members, 'work', work);
end $$;

create function public.update_class_work(
  assignment_uuid uuid,
  work_title text,
  work_instructions text,
  due_date date
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if length(trim(work_title)) not between 2 and 160
    or length(coalesce(work_instructions, '')) > 5000 or due_date is null then
    raise exception 'Invalid assignment';
  end if;
  update public.homework_assignments h
  set title = trim(work_title), instructions = coalesce(work_instructions, ''), due_at = due_date
  where h.id = assignment_uuid and h.tutor_id = auth.uid()
    and exists(select 1 from public.learning_classes c where c.id = h.class_id and c.user_id = auth.uid());
  if not found then raise exception 'Assignment not found or access denied'; end if;
end $$;

revoke all on function public.update_class_work(uuid,text,text,date) from public, anon;
grant execute on function public.update_class_work(uuid,text,text,date) to authenticated;
