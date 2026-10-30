-- A tutor can personalize only a learner who belongs to one of their classes.
-- Existing completions and earned currency remain intact; the changed placement
-- immediately rebuilds the visible path while preserving the learning history.
create function public.personalize_student_course(
  class_uuid uuid,
  student_uuid uuid,
  course_plan jsonb,
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
  existing jsonb;
  next_placement jsonb;
  assignment_id uuid;
  level_name text := course_plan->>'level';
  interest_name text := course_plan->>'interest';
  focus_modules jsonb := course_plan->'focus_modules';
begin
  if not private.is_tutor()
    or not exists(
      select 1
      from public.learning_classes c
      join public.class_members m on m.class_id = c.id
      where c.id = class_uuid and c.user_id = auth.uid() and m.user_id = student_uuid
    ) then
    raise exception 'Choose a learner from one of your classes';
  end if;

  if level_name not in ('A1','A2','B1','B2','C1','C2')
    or interest_name not in ('everyday','travel','stories','school')
    or jsonb_typeof(course_plan->'skill_levels') is distinct from 'object'
    or not ((course_plan->'skill_levels') ?& array['grammar','vocabulary','reading','listening'])
    or jsonb_typeof(focus_modules) is distinct from 'array'
    or jsonb_array_length(focus_modules) not between 2 and 4
    or length(coalesce(course_plan->>'summary','')) not between 20 and 1500
    or exists(select 1 from jsonb_array_elements_text(focus_modules) as focus(value) where length(value) not between 2 and 100)
    or length(trim(work_title)) not between 2 and 160
    or length(work_instructions) not between 2 and 5000
    or due_date < current_date
    or practice not like '/lessons/%'
    or practice like '//%' then
    raise exception 'Invalid personalized course';
  end if;

  if exists(
    select 1 from (values
      (course_plan#>>'{skill_levels,grammar}'),
      (course_plan#>>'{skill_levels,vocabulary}'),
      (course_plan#>>'{skill_levels,reading}'),
      (course_plan#>>'{skill_levels,listening}')
    ) as skills(value)
    where value is not null and value not in ('A1','A2','B1','B2','C1','C2')
  ) then
    raise exception 'Invalid skill profile';
  end if;

  perform pg_advisory_xact_lock(hashtext(student_uuid::text));
  select placement into existing from public.course_profiles where user_id = student_uuid;
  next_placement := jsonb_build_object(
    'id', 'tutor-ai-' || gen_random_uuid()::text,
    'created_at', now(),
    'level', level_name,
    'skill_levels', course_plan->'skill_levels',
    'answers', coalesce(existing->'answers', '[]'::jsonb),
    'writing_sample', coalesce(existing->>'writing_sample', ''),
    'speaking_practised', coalesce((existing->>'speaking_practised')::boolean, false),
    'settings', jsonb_build_object(
      'daily_minutes', coalesce((existing#>>'{settings,daily_minutes}')::integer, 10),
      'interest', interest_name
    ),
    'personalization', jsonb_build_object(
      'summary', course_plan->>'summary',
      'focus_modules', focus_modules,
      'source', 'tutor_photos',
      'tutor_id', auth.uid(),
      'updated_at', now()
    )
  );

  insert into public.course_profiles(user_id, placement, updated_at)
  values(student_uuid, next_placement, now())
  on conflict(user_id) do update set placement = excluded.placement, updated_at = now();

  insert into public.homework_assignments(user_id, tutor_id, title, instructions, due_at, practice_path, class_id)
  values(student_uuid, auth.uid(), trim(work_title), work_instructions, due_date, practice, class_uuid)
  returning id into assignment_id;
  return assignment_id;
end
$$;

revoke all on function public.personalize_student_course(uuid,uuid,jsonb,text,text,date,text) from public, anon;
grant execute on function public.personalize_student_course(uuid,uuid,jsonb,text,text,date,text) to authenticated;
