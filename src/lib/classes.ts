import { supabase } from "./supabase";
import { assertLiveMutation, isSandboxMode } from "./sandbox";
export type ClassMember = { user_id: string; name: string; xp: number; course_level: string; completed: number; pending: number };
export type ClassWork = {
  id: string;
  user_id: string;
  name: string;
  title: string;
  due_at: string;
  submitted_at: string | null;
  status: "submitted" | "pending" | "overdue";
};
export type ClassOverview = { members: ClassMember[]; work: ClassWork[] };
export async function loadClassOverview(id: string): Promise<ClassOverview> {
  if (isSandboxMode())
    return {
      members: [{ user_id: "sandbox", name: "Test Learner", xp: 1600, course_level: "B2", completed: 3, pending: 1 }],
      work: [
        {
          id: "sample",
          user_id: "sandbox",
          name: "Test Learner",
          title: "A real-world conversation",
          due_at: new Date().toISOString().slice(0, 10),
          submitted_at: null,
          status: "pending",
        },
      ],
    };
  const { data, error } = await supabase.rpc("class_overview", { class_uuid: id }, { get: true });
  if (error) throw Error("Could not load this class. Please try again.");
  return data as ClassOverview;
}
export async function deleteLearningClass(id: string) {
  assertLiveMutation();
  const { error } = await supabase.rpc("delete_learning_class", { class_uuid: id });
  if (error) throw Error(error.message);
}
