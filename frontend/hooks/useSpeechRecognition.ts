'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
  onstart: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
    mozSpeechRecognition?: SpeechRecognitionConstructor
    msSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

// Check if speech recognition is available (runs once)
const checkSpeechSupport = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition
  )
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { language } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { onResult, onError } = options

  // Mark as mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check support only after mount (client-side)
  const isSupported = mounted ? checkSpeechSupport() : true // Assume true until mounted to avoid flash

  // Initialize recognition
  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null

    const SpeechRecognitionAPI = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition

    if (!SpeechRecognitionAPI) return null

    const recognition = new SpeechRecognitionAPI()
    
    // Configure recognition
    recognition.continuous = false // Stop after one result
    recognition.interimResults = true // Get partial results
    recognition.lang = language === 'pt-br' ? 'pt-BR' : 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setTranscript(currentTranscript)

      if (finalTranscript && onResult) {
        onResult(finalTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = getErrorMessage(event.error)
      setError(errorMessage)
      setIsListening(false)
      if (onError) {
        onError(errorMessage)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    return recognition
  }, [language, onResult, onError])

  // Get user-friendly error messages
  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'No microphone found. Please connect a microphone.',
      'network': 'Network error. Please check your connection.',
      'aborted': 'Speech recognition aborted.',
      'service-not-allowed': 'Speech recognition service not allowed.',
    }
    return errorMessages[error] || `Speech recognition error: ${error}`
  }

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser')
      return
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = initRecognition()
    if (recognition) {
      recognitionRef.current = recognition
      setTranscript('')
      recognition.start()
    }
  }, [isSupported, initRecognition])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
  }
}

