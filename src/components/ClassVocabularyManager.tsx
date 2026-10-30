import { useEffect, useState } from "react";
import type { ClassMember } from "../lib/classes";
import { addClassVocabulary, loadClassVocabulary, removeClassVocabulary, updateClassVocabulary } from "../lib/classVocabulary";
import type { ClassWord, WordDraft } from "../lib/classVocabulary";
import { useI18n } from "../lib/i18n";
import { useLearning } from "../lib/learningContext";
import { Icon } from "./Icon";

const emptyDraft: WordDraft = { word: "", definition: "", example: "", translation_de: "", translation_ru: "", translation_kk: "" };

export function ClassVocabularyManager({ classId, members, selectedIds }: { classId: string; members: ClassMember[]; selectedIds: string[] }) {
  const { t } = useI18n();
  const { session } = useLearning();
  const [words, setWords] = useState<ClassWord[]>([]);
  const [draft, setDraft] = useState<WordDraft>(emptyDraft);
  const [editing, setEditing] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const reload = () => loadClassVocabulary(classId).then(setWords).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load vocabulary."));
  useEffect(() => { void reload(); }, [classId]);

  function beginEdit(word: ClassWord) {
    setEditing(word.id);
    setDraft({ word: word.word, definition: word.definition, example: word.example, translation_de: word.translation, translation_ru: word.translation_ru ?? "", translation_kk: word.translation_kk ?? "" });
    setOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setError("");
    try {
      if (editing) await updateClassVocabulary(editing, draft);
      else {
        const targetIds = selectedIds.length === members.length ? [] : selectedIds;
        await addClassVocabulary(classId, session.user.id, targetIds, draft);
      }
      setDraft(emptyDraft);
      setEditing("");
      setOpen(false);
      await reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this word.");
    } finally { setBusy(false); }
  }

  return (
    <section className="card class-vocabulary-manager">
      <div className="card-heading"><div><h2>{t("Class vocabulary")}</h2><p>{t("AI-extracted words and tutor-added words appear in learner vocabulary games.")}</p></div>
        <button onClick={() => { setOpen(!open); setEditing(""); setDraft(emptyDraft); }}><Icon name="plus" size={15} />{t("Add word")}</button></div>
      {open && <form className="form class-word-form" onSubmit={(event) => void save(event)}>
        <div className="form-grid"><label className="field">{t("Word")}<input required maxLength={80} value={draft.word} onChange={(event) => setDraft({ ...draft, word: event.target.value })} /></label>
          <label className="field">{t("Definition")}<input required maxLength={500} value={draft.definition} onChange={(event) => setDraft({ ...draft, definition: event.target.value })} /></label></div>
        <label className="field">{t("Example sentence")}<input required maxLength={500} value={draft.example} onChange={(event) => setDraft({ ...draft, example: event.target.value })} /></label>
        <div className="form-grid class-word-translations">
          {([['translation_de','Deutsch'],['translation_ru','Русский'],['translation_kk','Қазақша']] as const).map(([key, label]) => <label className="field" key={key}>{label}<input value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}
        </div>
        {!editing && <p className="preference-hint">{selectedIds.length === members.length ? t("This word will be available to the whole class.") : t("This word will be added to {count} selected learners.", { count: selectedIds.length })}</p>}
        <div className="button-row"><button disabled={busy || (!editing && !selectedIds.length)}>{t(busy ? "Saving…" : editing ? "Save word" : "Add to vocabulary")}</button><button type="button" className="secondary" onClick={() => setOpen(false)}>{t("Cancel")}</button></div>
      </form>}
      <div className="class-word-list">
        {words.map((word) => <article key={word.id}><div><strong>{word.word}</strong><span className={`status-badge ${word.source === 'manual' ? 'gray' : 'blue'}`}>{t(word.source)}</span><p>{word.definition}</p><small>{word.student_id ? members.find((member) => member.user_id === word.student_id)?.name ?? t("Learner") : t("Whole class")}</small></div>
          <div className="button-row"><button className="icon-button" aria-label={t("Edit word")} onClick={() => beginEdit(word)}><Icon name="edit" size={15} /></button><button className="icon-button" aria-label={t("Delete word")} onClick={() => void removeClassVocabulary(word.id).then(reload)}><Icon name="trash" size={15} /></button></div></article>)}
      </div>
      {!words.length && !open && <p>{t("No class vocabulary yet. Photo assignments can create the first words automatically.")}</p>}
      {error && <p className="message" role="alert">{t(error)}</p>}
    </section>
  );
}
