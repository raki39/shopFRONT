'use client'

import { useLanguageContext, type Language } from '@/contexts/LanguageContext'
import { translations, type TranslationKeys } from '@/lib/i18n/translations'

export function useTranslation() {
  const { language, setLanguage, toggleLanguage, mounted, isPortuguese, isEnglish } = useLanguageContext()

  // Get translations for current language
  const t = translations[language] as TranslationKeys

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
    mounted,
    isPortuguese,
    isEnglish,
  }
}

// Helper type for accessing nested translation keys
export type { Language }

