// pages/signup.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery } from 'react-query'
import api from '../components/api'
import { setToken, clearToken } from '../utils/auth'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [selected, setSelected] = useState([])
  const [error, setError]       = useState('')

  // fetch regions just to display the checkboxes
  const { data: regions = [], isLoading } = useQuery('regions', api.getRegions)

  const toggleRegion = (name) => {
    setSelected(sel =>
      sel.includes(name)
        ? sel.filter(r => r !== name)
        : [...sel, name]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (selected.length === 0) {
      setError("Please select at least one region")
      return
    }

    try {
      // 1. Create the user
      await api.register(email, password)

      // 2. Log them in to get a token
      const token = await api.login(email, password)
      setToken(token)

      // 3. Subscribe to each selected region
      await Promise.all(
        selected.map(region => api.subscribe(region, token))
      )

      // 4. Clear the token so they can explicitly log in
      clearToken()

      // 5. Redirect to login
      router.push('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  if (isLoading) return <p>Loading regions…</p>

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Sign Up
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="password"
          required
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
        />

        <fieldset className="p-4 border rounded bg-gray-100 dark:bg-gray-700">
          <legend className="font-medium text-gray-700 dark:text-gray-300">
            Select regions to receive alerts
          </legend>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
            {regions.map(r => (
              <label key={r.id} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selected.includes(r.name)}
                  onChange={() => toggleRegion(r.name)}
                  className="form-checkbox"
                />
                <span className="capitalize text-gray-900 dark:text-gray-100">
                  {r.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Create Account & Subscribe
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  )
}
