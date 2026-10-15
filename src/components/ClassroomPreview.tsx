import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from './Card';
import { Icon } from './Icon';
import { useI18n } from '../lib/i18n';

export function ClassroomPreview() {
  const { t } = useI18n();
  const [slide, setSlide] = useState(0);
  const slides = [
    'Main idea first',
    'Sentence 1: answer the question.',
    'Sentence 2: add one important detail.',
    'A shorter answer can already be complete.',
  ];
  return (
    <Card title={t('Classroom preview')}>
      <p>{t('This preview has no other participant. Sign in to join a real lesson.')}</p>
      <div className="classroom-slide">
        <span className="eyebrow">
          {slide + 1} / {slides.length}
        </span>
        <h2>{t(slides[slide])}</h2>
        <p lang="en">
          {slide === 0 ? t('How was your morning?') : t('My morning was a bit rushed because I woke up late.')}
        </p>
      </div>
      <div className="button-row">
        <button className="secondary" onClick={() => setSlide((slide + 1) % slides.length)}>
          {t('Preview next slide')}
          <Icon name="arrow" size={16} />
        </button>
        <Link href="/sign-in" className="button primary">
          {t('Sign in')}
        </Link>
      </div>
    </Card>
  );
}
