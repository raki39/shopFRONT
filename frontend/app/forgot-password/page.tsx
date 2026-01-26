'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { Mail, Loader2, Sun, Moon, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'

export default function ForgotPasswordPage() {
  // Theme
  const { darkMode, toggleDarkMode, mounted } = useTheme()

  // Translation
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Theme styles matching login
  const bgGradient = darkMode ? 'bg-slate-950' : 'bg-slate-50'
  const glassCard = darkMode ? 'bg-white/5 backdrop-blur-xl' : 'bg-white border border-slate-200'
  const textSecondary = darkMode ? 'text-white/70' : 'text-gray-600'
  const textMuted = darkMode ? 'text-white/40' : 'text-gray-400'
  const inputStyle = darkMode
    ? 'bg-white/5 border-transparent text-white placeholder:text-white/30 focus:border-white/20 focus:bg-white/10'
    : 'bg-white border border-slate-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-400'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authAPI.forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      console.error('Forgot password error:', err)
      setError(err.response?.data?.detail || t.forgotPassword.error)
    } finally {
      setLoading(false)
    }
  }

  // Prevent flash - show themed loading until mounted
  if (!mounted) {
    return <div className="min-h-screen theme-loading-bg" />
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgGradient} transition-colors duration-300 p-4`}>
      {/* Ambient Background Effects */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
        </div>
      )}

      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-20">
        <button
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl ${glassCard} ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-all duration-300`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Forgot Password Card */}
      <div className={`w-full max-w-sm ${glassCard} rounded-2xl p-8 relative z-10`}>
        {/* Title and Description */}
        <div className="flex flex-col items-center mb-6 gap-2">
          <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.forgotPassword.title}
          </h1>
          <p className={`text-sm text-center ${textSecondary}`}>
            {t.forgotPassword.description}
          </p>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm text-center ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{t.forgotPassword.success}</p>
            </div>
            <Link
              href="/login"
              className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
            >
              <ArrowLeft className="w-5 h-5" />
              {t.forgotPassword.backToLogin}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t.forgotPassword.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-xl ${inputStyle} transition-all duration-300 outline-none`}
                placeholder={t.forgotPassword.emailPlaceholder}
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 mt-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.forgotPassword.loading}
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  {t.forgotPassword.submit}
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <p className={`text-center text-sm ${textSecondary} mt-4`}>
              <Link href="/login" className={`font-medium ${darkMode ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'}`}>
                {t.forgotPassword.backToLogin}
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className={`text-center text-sm ${textMuted} mt-6 relative z-10`}>
        {t.forgotPassword.footer}
      </p>
    </div>
  )
}

