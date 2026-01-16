'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type Language = 'pt-br' | 'en'

const LANGUAGE_STORAGE_KEY = 'varejo180_language'
const DEFAULT_LANGUAGE: Language = 'pt-br'

// Get language from data-lang attribute (set by inline script before React)
function getLanguageFromDOM(): Language {
  if (typeof document === 'undefined') return DEFAULT_LANGUAGE
  const lang = document.documentElement.getAttribute('data-lang')
  return lang === 'en' ? 'en' : 'pt-br'
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  mounted: boolean
  isPortuguese: boolean
  isEnglish: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize from DOM attribute (already set by inline script)
  const [language, setLanguageState] = useState<Language>(() => getLanguageFromDOM())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Sync state with DOM on mount
    setLanguageState(getLanguageFromDOM())
  }, [])

  // Set language - updates localStorage, DOM attribute, and state
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
    document.documentElement.setAttribute('data-lang', newLanguage)
  }, [])

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => {
      const newLang = prev === 'pt-br' ? 'en' : 'pt-br'
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang)
      document.documentElement.setAttribute('data-lang', newLang)
      return newLang
    })
  }, [])

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    mounted,
    isPortuguese: language === 'pt-br',
    isEnglish: language === 'en',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}

// For backward compatibility - use this in components that need language
export function useLanguage() {
  return useLanguageContext()
}

