import { supabase } from "./supabase";
import type { Word } from "./types";

export type ClassWord = Word & { class_id: string; student_id: string | null; source: "manual" | "extracted" | "support" };
export type WordDraft = Pick<Word, "word" | "definition" | "example"> & {
  translation_de: string;
  translation_ru: string;
  translation_kk: string;
};

export async function loadClassVocabulary(classId: string) {
  const { data, error } = await supabase.from("vocabulary").select("*").eq("class_id", classId).order("word").returns<ClassWord[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addClassVocabulary(classId: string, tutorId: string, studentIds: string[], draft: WordDraft) {
  const targets: Array<string | null> = studentIds.length ? studentIds : [null];
  const rows = targets.map((studentId) => ({
    id: `class-vocab-${crypto.randomUUID()}`,
    user_id: tutorId,
    class_id: classId,
    student_id: studentId,
    source: "manual",
    word: draft.word.trim(),
    translation: draft.translation_de.trim() || draft.word.trim(),
    translation_ru: draft.translation_ru.trim() || draft.word.trim(),
    translation_kk: draft.translation_kk.trim() || draft.word.trim(),
    definition: draft.definition.trim(),
    example: draft.example.trim(),
    theme: "Class vocabulary",
    difficulty: "B1",
  }));
  const { error } = await supabase.from("vocabulary").insert(rows);
  if (error) throw new Error(error.message);
}

export async function updateClassVocabulary(id: string, draft: WordDraft) {
  const { error } = await supabase.from("vocabulary").update({
    word: draft.word.trim(),
    translation: draft.translation_de.trim() || draft.word.trim(),
    translation_ru: draft.translation_ru.trim() || draft.word.trim(),
    translation_kk: draft.translation_kk.trim() || draft.word.trim(),
    definition: draft.definition.trim(),
    example: draft.example.trim(),
  }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function removeClassVocabulary(id: string) {
  const { error } = await supabase.from("vocabulary").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
