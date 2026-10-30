import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';
import { useLearning } from '../lib/learningContext';
import { createBookCourse, loadSourceBooks } from '../lib/bookCourse';
import type { AssessmentKind, SourceBook } from '../lib/bookCourse';

export function TutorBookCourse() {
  const { t } = useI18n();
  const { session, refresh, setNotice } = useLearning();
  const [books, setBooks] = useState<SourceBook[]>([]);
  const [bookId, setBookId] = useState('new');
  const [bookName, setBookName] = useState('');
  const [front, setFront] = useState<File>();
  const [back, setBack] = useState<File>();
  const [materials, setMaterials] = useState<File[]>([]);
  const [kind, setKind] = useState<AssessmentKind>('quiz');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ lessonId: string; questionCount: number; difficulty: string }>();

  useEffect(() => {
    void loadSourceBooks().then(setBooks).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not load books.'));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    const book = books.find((item) => item.id === bookId);
    if (!book && (!bookName.trim() || !front || !back)) {
      setError('For a new book, add its name and clear front and back cover images.');
      return;
    }
    if (!materials.length) {
      setError('Add at least one homework or textbook-page image.');
      return;
    }
    setBusy(true);
    setError('');
    setResult(undefined);
    try {
      const created = await createBookCourse({
        userId: session.user.id,
        book,
        bookName,
        front: book ? undefined : front,
        back: book ? undefined : back,
        materials,
        assessmentKind: kind,
      });
      setResult(created);
      await refresh();
      setBooks(await loadSourceBooks());
      setNotice(t('AI lesson created from the supplied images.'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the course lesson.');
    } finally {
      setBusy(false);
    }
  }

  const isNew = bookId === 'new';
  return (
    <div className="stack">
      <Card title={t('Create a course lesson from book photos')} className="tutor-form">
        <p>{t('AI reads only the images you provide. Unclear or mismatched material is skipped instead of guessed.')}</p>
        <form className="form spaced" onSubmit={(event) => void submit(event)}>
          <div className="form-grid">
            <label className="field wide">
              {t('Book')}
              <select value={bookId} onChange={(event) => setBookId(event.target.value)}>
                <option value="new">{t('Add a new book')}</option>
                {books.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
              </select>
            </label>
            {isNew && (
              <>
                <label className="field wide">
                  {t('Exact book name')}
                  <input value={bookName} onChange={(event) => setBookName(event.target.value)} required />
                </label>
                <label className="field">
                  {t('Front cover')}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFront(event.target.files?.[0])} required />
                </label>
                <label className="field">
                  {t('Back cover')}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setBack(event.target.files?.[0])} required />
                </label>
              </>
            )}
            <label className="field wide">
              {t('Homework or textbook pages (up to 6)')}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                required
                onChange={(event) => setMaterials(Array.from(event.target.files ?? []).slice(0, 6))}
              />
            </label>
            <label className="field wide">
              {t('Practice format')}
              <select value={kind} onChange={(event) => setKind(event.target.value as AssessmentKind)}>
                <option value="quiz">{t('Quiz — randomly 5, 10, 15, or 20 questions')}</option>
                <option value="easy_test">{t('Easier test — 20 questions')}</option>
                <option value="hard_test">{t('Harder test — 10 questions')}</option>
              </select>
            </label>
          </div>
          <div className="gentle-note">
            <Icon name="shield" size={22} />
            <p>{t('Use clear, straight photos. Images are sent for analysis but are not saved in the app. Review generated material before assigning it.')}</p>
          </div>
          {error && <p className="message" role="alert">{t(error)}</p>}
          <button disabled={busy}>
            <Icon name="sparkles" size={17} />
            {busy ? t('Reading images and building the lesson…') : t('Create lesson and practice')}
          </button>
        </form>
      </Card>
      {result && (
        <Card title={t('Lesson ready')}>
          <p>{t(`${result.difficulty} lesson with ${result.questionCount} questions was created.`)}</p>
          <Link className="button primary spaced" href={`/lessons/${result.lessonId}`}>
            {t('Review lesson')} <Icon name="arrow" size={16} />
          </Link>
        </Card>
      )}
      <Card title={t('Saved source books')}>
        {books.length ? (
          <div className="tutor-list">
            {books.map((book) => <div className="tutor-row" key={book.id}><strong>{book.name}</strong><p>{book.identity_notes}</p></div>)}
          </div>
        ) : <p>{t('No books added yet. The first import requires both covers.')}</p>}
      </Card>
    </div>
  );
}
