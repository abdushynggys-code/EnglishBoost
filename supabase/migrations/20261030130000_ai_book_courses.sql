create table public.ai_source_books (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references public.profiles on delete cascade,
  name text not null check (length(trim(name)) between 2 and 160),
  identity_notes text not null check (length(identity_notes) between 10 and 4000),
  created_at timestamptz not null default now()
);

create unique index ai_source_books_tutor_name
  on public.ai_source_books (tutor_id, lower(name));

create table public.ai_course_imports (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references public.profiles on delete cascade,
  book_id uuid not null references public.ai_source_books on delete cascade,
  lesson_id text not null references public.lessons on delete cascade,
  extracted_text text not null check (length(extracted_text) between 10 and 30000),
  assessment_kind text not null check (assessment_kind in ('quiz', 'easy_test', 'hard_test')),
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate')),
  question_count integer not null check (question_count in (5, 10, 15, 20)),
  created_at timestamptz not null default now()
);

alter table public.ai_source_books enable row level security;
alter table public.ai_course_imports enable row level security;

grant select, insert, update, delete on public.ai_source_books to authenticated;
grant select, insert, delete on public.ai_course_imports to authenticated;

create policy "tutors manage own source books" on public.ai_source_books
  for all to authenticated
  using (private.is_tutor() and tutor_id = auth.uid())
  with check (private.is_tutor() and tutor_id = auth.uid());

create policy "tutors read own course imports" on public.ai_course_imports
  for select to authenticated
  using (private.is_tutor() and tutor_id = auth.uid());

create policy "tutors create own course imports" on public.ai_course_imports
  for insert to authenticated
  with check (
    private.is_tutor()
    and tutor_id = auth.uid()
    and exists (
      select 1 from public.ai_source_books b
      where b.id = book_id and b.tutor_id = auth.uid()
    )
    and exists (
      select 1 from public.lessons l
      where l.id = lesson_id and l.user_id = auth.uid()
    )
  );

create policy "tutors delete own course imports" on public.ai_course_imports
  for delete to authenticated
  using (private.is_tutor() and tutor_id = auth.uid());

create index ai_course_imports_book_created
  on public.ai_course_imports (book_id, created_at desc);
