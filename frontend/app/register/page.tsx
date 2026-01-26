'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI, agentsAPI } from '@/lib/api'
import { DEFAULT_AGENT } from '@/lib/defaultUserSetup'
import { UserPlus, Loader2, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()

  // Theme
  const { darkMode, toggleDarkMode, mounted } = useTheme()

  // Translation
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

  const { setAuth, logout } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t.register.passwordMismatch)
      return
    }

    setLoading(true)

    try {
      // 1. Register the user
      await authAPI.register(name, email, password)

      // 2. Login to get auth token for creating default agent
      try {
        const loginResponse = await authAPI.login(email, password)
        setAuth(loginResponse.user, loginResponse.access_token)

        // 3. Create default agent (usando conexão e contexto do usuário 1)
        try {
          await agentsAPI.create(DEFAULT_AGENT)
        } catch (agentErr) {
          console.warn('Could not create default agent:', agentErr)
        }

        // Logout after creating resources (user will login manually)
        logout()
      } catch (loginErr) {
        console.warn('Could not auto-login to create default resources:', loginErr)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      console.error('Register error:', err)
      // Handle error - detail can be a string or array of validation errors
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else if (Array.isArray(detail) && detail.length > 0) {
        // Extract message from validation error
        setError(detail[0]?.msg || t.register.error)
      } else {
        setError(t.register.error)
      }
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

      {/* Register Card */}
      <div className={`w-full max-w-sm ${glassCard} rounded-2xl p-8 relative z-10`}>
        {/* Logos */}
        <div className="flex flex-col items-center mb-8 gap-3">
          {/* Varejo 180 */}
          <img
            src="/VAREJO180.png"
            alt="Varejo"
            className={`h-16 w-auto object-contain ${darkMode ? 'brightness-0 invert' : ''}`}
          />

          {/* Powered By */}
          <p className={`text-xs font-semibold ${textMuted} tracking-wide`}>{t.common.poweredBy}</p>

          {/* Shopping Brasil e Sellbit */}
          <div className="flex items-center gap-4">
            <img
              src="/image-1.png"
              alt="Shopping Brasil"
              className={`h-8 w-auto object-contain ${darkMode ? 'brightness-0 invert' : ''}`}
            />
            <img
              src="/login-logo.png"
              alt="Sellbit"
              className={`h-8 w-auto object-contain ${darkMode ? 'brightness-0 invert' : ''}`}
            />
          </div>
        </div>

        {/* Success Message */}
        {success ? (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm text-center ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{t.register.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t.register.name}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-xl ${inputStyle} transition-all duration-300 outline-none`}
                placeholder={t.register.namePlaceholder}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t.register.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-xl ${inputStyle} transition-all duration-300 outline-none`}
                placeholder={t.register.emailPlaceholder}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t.register.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-xl ${inputStyle} transition-all duration-300 outline-none`}
                placeholder={t.register.passwordPlaceholder}
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${textSecondary} mb-2`}>
                {t.register.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-xl ${inputStyle} transition-all duration-300 outline-none`}
                placeholder={t.register.confirmPasswordPlaceholder}
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
              className={`
                w-full py-2 px-4 mt-4 rounded-xl font-medium transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                ${darkMode
                  ? 'bg-white/10 text-white hover:bg-white/15'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.register.loading}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  {t.register.submit}
                </>
              )}
            </button>

            {/* Login Link */}
            <p className={`text-center text-sm ${textSecondary} mt-4`}>
              {t.register.hasAccount}{' '}
              <Link href="/login" className={`font-medium ${darkMode ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'}`}>
                {t.register.login}
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className={`text-center text-sm ${textMuted} mt-6 relative z-10`}>
        {t.register.footer}
      </p>
    </div>
  )
}

