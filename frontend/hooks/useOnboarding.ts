'use client'

import { useEffect, useState, useCallback } from 'react'
import { driver, Driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useStore } from '@/lib/store'
import { usersAPI } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'
import type { TranslationKeys } from '@/lib/i18n/translations'

interface UseOnboardingOptions {
  page: 'select-agent' | 'chat'
  darkMode: boolean
  enabled?: boolean
}

// Steps configuration for each page - now receives translations
const getSelectAgentSteps = (t: TranslationKeys): DriveStep[] => [
  {
    element: '#onboarding-header',
    popover: {
      title: t.onboarding.welcome,
      description: t.onboarding.welcomeDesc,
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#onboarding-agents-grid',
    popover: {
      title: t.onboarding.agents,
      description: t.onboarding.agentsDesc,
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#onboarding-agent-card',
    popover: {
      title: t.onboarding.startConversation,
      description: t.onboarding.startConversationDesc,
      side: 'left',
      align: 'start',
    },
  },
]

const getChatSteps = (t: TranslationKeys): DriveStep[] => [
  {
    element: '#onboarding-sidebar',
    popover: {
      title: t.onboarding.conversationHistory,
      description: t.onboarding.conversationHistoryDesc,
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#onboarding-new-chat',
    popover: {
      title: t.onboarding.newConversation,
      description: t.onboarding.newConversationDesc,
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '#onboarding-input',
    popover: {
      title: t.onboarding.askQuestion,
      description: t.onboarding.askQuestionDesc,
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#onboarding-settings',
    popover: {
      title: t.onboarding.settingsTitle,
      description: t.onboarding.settingsDesc,
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '#onboarding-theme-toggle',
    popover: {
      title: t.onboarding.toggleTheme,
      description: t.onboarding.toggleThemeDesc,
      side: 'bottom',
      align: 'end',
    },
  },
]

export function useOnboarding({ page, darkMode, enabled = true }: UseOnboardingOptions) {
  const { user, setUser } = useStore()
  const { t, language } = useTranslation()
  const [driverInstance, setDriverInstance] = useState<Driver | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStartedThisSession, setHasStartedThisSession] = useState(false)

  // Check if we already started the tour this session (to avoid re-triggering on re-renders)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionKey = `onboarding_started_${page}`
      const started = sessionStorage.getItem(sessionKey)
      if (started === 'true') {
        setHasStartedThisSession(true)
      }
    }
  }, [page])

  // Check if onboarding should run
  // Only check: enabled + user exists + onboarding not completed + not started this session
  const shouldRunOnboarding = enabled && user && !user.onboarding_completed && !hasStartedThisSession

  // Get theme-specific styles
  const getPopoverClass = useCallback(() => {
    return darkMode ? 'onboarding-popover-dark' : 'onboarding-popover-light'
  }, [darkMode])

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    if (!user) return

    try {
      const updatedUser = await usersAPI.updateMe({ onboarding_completed: true })
      setUser(updatedUser)
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }, [user, setUser])

  // Mark tour as started in this session (prevents re-triggering on navigation/re-renders)
  const markAsStartedThisSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      const sessionKey = `onboarding_started_${page}`
      sessionStorage.setItem(sessionKey, 'true')
      setHasStartedThisSession(true)
    }
  }, [page])

  // Get button texts based on language
  const isEnglish = language === 'en'
  const nextBtnText = isEnglish ? 'Next' : 'Próximo'
  const prevBtnText = isEnglish ? 'Previous' : 'Anterior'
  const doneBtnText = isEnglish ? 'Finish' : 'Concluir'
  const progressText = isEnglish ? '{{current}} of {{total}}' : '{{current}} de {{total}}'

  // Start the tour
  const startTour = useCallback(() => {
    if (!shouldRunOnboarding || isRunning) return

    // Mark as started immediately to prevent re-triggering
    markAsStartedThisSession()

    const steps = page === 'select-agent' ? getSelectAgentSteps(t) : getChatSteps(t)

    const driverObj = driver({
      showProgress: true,
      steps,
      nextBtnText,
      prevBtnText,
      doneBtnText,
      progressText,
      popoverClass: getPopoverClass(),
      stagePadding: 12,
      stageRadius: 8,
      allowClose: true,
      smoothScroll: true,
      // Prevent closing when clicking outside the popover - only close via X button
      overlayClickBehavior: () => {
        // Do nothing when clicking on overlay - tour only closes via X button
      },
      onDestroyed: () => {
        if (page === 'chat') {
          completeOnboarding()
        }
        setIsRunning(false)
      },
    })

    setDriverInstance(driverObj)
    setIsRunning(true)

    // Small delay to ensure elements are rendered
    setTimeout(() => {
      driverObj.drive()
    }, 600)
  }, [shouldRunOnboarding, isRunning, page, getPopoverClass, completeOnboarding, markAsStartedThisSession, t, nextBtnText, prevBtnText, doneBtnText, progressText])

  return {
    startTour,
    isRunning,
    shouldRunOnboarding,
    driverInstance,
  }
}

