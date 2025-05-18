// pages/high-risk.js
import { useQuery } from 'react-query'
import api from '../components/api'
import RegionMap from '../components/RegionMap'

export default function HighRisk() {
  const { data: latest = [], isLoading, error } = useQuery('latest', api.getLatest)
  const { data: regionsMeta = [] }            = useQuery('regions', api.getRegions)

  if (isLoading) return <p>Loading high-risk regions…</p>
  if (error)     return <p>Error loading data</p>

  const highRisk = latest.filter(f =>
    f.risk_level === 'High' || f.risk_level === 'Moderate'
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">High-Risk Region Analysis</h1>
        <p className="text-gray-600">
          Regions with elevated flood risks based on ML predictions
        </p>
      </div>

      <RegionMap forecasts={highRisk} regionsMeta={regionsMeta} />

      <div className="overflow-x-auto">
        <table className="min-w-full table-zebra divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Region</th>
              <th className="px-4 py-2 text-left">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {highRisk.map(f => (
              <tr key={f.region}>
                <td className="px-4 py-2">{f.region}</td>
                <td className="px-4 py-2">{f.risk_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
