// pages/forecast.js
import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '../components/api'

export default function Forecast() {
  const { data = [], isLoading, error } = useQuery('latest', api.getLatest)
  const [q, setQ]           = useState('')
  const [minScore, setMinScore] = useState(0)

  const filtered = data
    .filter(f => f.region.includes(q.toLowerCase()))
    .filter(f => f.prob_hybrid >= minScore)

  if (isLoading) return <p>Loading forecasts…</p>
  if (error)     return <p>Error loading forecasts</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Latest Flood Forecasts</h1>
      <p className="text-gray-600">
        ML-generated predictions based on meteorological and hydrological data
      </p>

      <div className="flex flex-wrap gap-4 my-4">
        <input
          type="text"
          placeholder="Search region…"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="p-2 border rounded flex-1 bg-white dark:bg-gray-800"
        />
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap">Min Risk Score:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={minScore}
            onChange={e => setMinScore(+e.target.value)}
          />
          <span>{minScore.toFixed(2)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-zebra divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              {['Region','Date','Risk Level','Risk Score'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-gray-800 dark:text-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.region}>
                <td className="px-4 py-2 font-medium">{f.region}</td>
                <td className="px-4 py-2">{f.forecast_date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-sm font-semibold rounded
                      ${
                        f.risk_level === 'High'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : f.risk_level === 'Moderate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      }`}
                  >
                    {f.risk_level}
                  </span>
                </td>
                <td className="px-4 py-2">{f.prob_hybrid.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
