// pages/historical.js
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { CSVLink } from 'react-csv'
import api from '../components/api'
import ChartCard from '../components/ChartCard'
import Chart from '../components/Chart'

export default function Historical() {
  const { data: regions = [], isLoading: regLoading } = useQuery(
    'regions',
    api.getRegions
  )

  const today = new Date().toISOString().slice(0,10)
  const [regionId, setRegionId]     = useState('')
  const [regionName, setRegionName] = useState('')
  const [startDate, setStartDate]   = useState('')
  const [endDate, setEndDate]       = useState(today)

  // on load, default to first region + 30-day window
  useEffect(() => {
    if (regions.length && !regionId) {
      setRegionId(regions[0].id)
      setRegionName(regions[0].name)
      const d = new Date()
      d.setDate(d.getDate() - 29)
      setStartDate(d.toISOString().slice(0,10))
    }
  }, [regions, regionId])

  const {
    data: history = [],
    isLoading: histLoading,
    error: histError,
  } = useQuery(
    ['history', regionId, startDate, endDate],
    () => api.getHistoryByRange(regionId, startDate, endDate),
    { enabled: Boolean(regionId && startDate && endDate) }
  )

  if (regLoading) return <p>Loading regions…</p>
  if (histError) return <p className="text-red-500">Error loading data.</p>

  // presets for “week / month / year / all”
  const presets = [
    { label: 'Week',  days: 7   },
    { label: 'Month', days: 30  },
    { label: 'Year',  days: 365 },
    { label: 'All',   days: null },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Historical Flood Data</h1>
      <p className="text-gray-600">
        Showing risk for <strong>{regionName}</strong>.
      </p>

      {/* controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block font-medium">Region:</label>
          <select
            className="mt-1 p-2 border rounded bg-white dark:bg-gray-800"
            value={regionId}
            onChange={e => {
              const sel = regions.find(r => r.id === e.target.value)
              setRegionId(e.target.value)
              setRegionName(sel?.name || '')
            }}
          >
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => {
                const end = new Date().toISOString().slice(0,10)
                let start
                if (p.days === null) {
                  start = history[0]?.forecast_date || end
                } else {
                  const d = new Date()
                  d.setDate(d.getDate() - p.days)
                  start = d.toISOString().slice(0,10)
                }
                setStartDate(start)
                setEndDate(end)
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              Last {p.label}
            </button>
          ))}
        </div>

        <CSVLink
          data={history}
          filename={`${regionName}-${startDate}-to-${endDate}.csv`}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Download CSV
        </CSVLink>
      </div>

      {/* chart or no-data message */}
      {histLoading ? (
        <p>Loading data…</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500">
          No data available for {regionName} between {startDate} and {endDate}.
        </p>
      ) : (
        <ChartCard title={`Risk & Actual Status — ${regionName}`}>
          <Chart data={history} />
        </ChartCard>
      )}
    </div>
  )
}
