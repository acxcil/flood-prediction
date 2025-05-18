import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getToken, clearToken } from '../utils/auth'
import api from './api'

export default function Layout({ children }) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser]       = useState(null)
  const router                = useRouter()

  const currentTheme = theme === 'system' ? systemTheme : theme

  const fetchUser = () => {
    const t = getToken()
    if (!t) return setUser(null)
    api.getCurrentUser(t)
      .then(setUser)
      .catch(() => {
        clearToken()
        setUser(null)
      })
  }

  useEffect(() => {
    setMounted(true)
    fetchUser()
    router.events.on('routeChangeComplete', fetchUser)
    return () => router.events.off('routeChangeComplete', fetchUser)
  }, [])

  const handleLogout = () => {
    clearToken()
    setUser(null)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Flood Alerts
        </h1>
        <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
          {user ? (
            <>
              <Link href="/subscriptions" className="hover:underline">
                My Alerts
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
            className="ml-4 text-xl"
          >
            {mounted
              ? (currentTheme === 'light' ? '🌙' : '☀️')
              : null}
          </button>
        </div>
      </header>

      {/* Secondary nav */}
      <nav className="bg-white dark:bg-gray-800 px-6 py-2">
        <ul className="flex space-x-6 text-gray-700 dark:text-gray-300">
          <li>
            <Link href="/" className="hover:underline">
              Overview
            </Link>
          </li>
          <li>
            <Link href="/forecast" className="hover:underline">
              Forecasts
            </Link>
          </li>
          <li>
            <Link href="/high-risk" className="hover:underline">
              High-Risk
            </Link>
          </li>
          <li>
            <Link href="/historical" className="hover:underline">
              Historical
            </Link>
          </li>
          <li>
            <Link href="/subscriptions" className="hover:underline">
              Subscriptions
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  )
}
