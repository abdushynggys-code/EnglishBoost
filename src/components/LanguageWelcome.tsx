import { Icon } from './Icon';
import { PreferencesForm } from './PreferencesForm';

export function LanguageWelcome() {
  return (
    <main className="language-welcome">
      <div className="welcome-brand">
        <Icon name="book" size={29} />
        <strong>EnglishBoost.</strong>
      </div>
      <section className="onboarding-card">
        <p className="eyebrow">ENGLISH · DEUTSCH · РУССКИЙ · ҚАЗАҚША</p>
        <PreferencesForm onboarding />
      </section>
    </main>
  );
}
