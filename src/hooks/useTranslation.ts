import { useAppSelector } from '../store/hooks';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';

const translations: Record<string, any> = { en, es, fr, de };

export const useTranslation = () => {
  const currentLang = useAppSelector((state) => state.language.currentLanguage);

  const t = (path: string): string => {
    const keys = path.split('.');
    let current = translations[currentLang] || translations['en'];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path; // Return key path if missing entirely
          }
        }
        return fallback;
      }
    }

    return typeof current === 'string' ? current : path;
  };

  return { t, currentLang };
};
export type UseTranslationResponse = ReturnType<typeof useTranslation>;
