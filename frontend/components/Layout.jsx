// components/Layout.jsx
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        {/* Top Row */}
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Flood Alerts
          </h1>
          <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign Up
            </Link>
            <button
              onClick={() =>
                setTheme(currentTheme === 'light' ? 'dark' : 'light')
              }
              aria-label="Toggle theme"
              className="ml-2 text-xl"
            >
              {mounted
                ? currentTheme === 'light'
                  ? '🌙'
                  : '☀️'
                : null}
            </button>
          </div>
        </div>

        {/* Bottom Nav */}
        <nav className="border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6">
            <ul className="flex space-x-8 py-3 text-gray-700 dark:text-gray-300">
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
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
