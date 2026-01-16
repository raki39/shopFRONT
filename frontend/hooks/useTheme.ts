'use client'

import { useState, useEffect, useCallback } from 'react'

const THEME_STORAGE_KEY = 'varejo180_theme'

// Get theme from data-theme attribute (set by inline script before React)
function getThemeFromDOM(): boolean {
  if (typeof document === 'undefined') return true
  return document.documentElement.getAttribute('data-theme') !== 'light'
}

export function useTheme() {
  // Initialize from DOM attribute (already set by inline script)
  const [darkMode, setDarkModeState] = useState(() => getThemeFromDOM())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Sync state with DOM on mount
    setDarkModeState(getThemeFromDOM())
  }, [])

  // Toggle dark mode - updates localStorage, DOM attribute, and state
  const toggleDarkMode = useCallback(() => {
    setDarkModeState(prev => {
      const newValue = !prev
      const theme = newValue ? 'dark' : 'light'
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      document.documentElement.setAttribute('data-theme', theme)
      return newValue
    })
  }, [])

  // Set dark mode directly
  const setDarkMode = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value
      const theme = newValue ? 'dark' : 'light'
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      document.documentElement.setAttribute('data-theme', theme)
      return newValue
    })
  }, [])

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    mounted,
  }
}

