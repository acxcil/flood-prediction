// pages/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../components/api'
import { setToken } from '../utils/auth'

export default function Login() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr]         = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const token = await api.login(email, password)
      setToken(token)
      router.push('/subscriptions')
    } catch {
      setErr('Invalid credentials')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
        Login
      </h1>
      {err && <p className="text-red-500 mb-2">{err}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
        Don’t have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
