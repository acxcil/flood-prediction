// pages/index.js
import { useQuery } from 'react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../components/api'
import Banner from '../components/Banner'
import MetricCard from '../components/MetricCard'
import ChartCard from '../components/ChartCard'
import {
  UsersIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function Overview() {
  const { data = [], isLoading, error } = useQuery('latest', api.getLatest)

  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Error loading data</p>

  // 1. Total regions monitored
  const totalRegions = data.length

  // 2. Counts by risk level
  const highCount = data.filter((d) => d.risk_level === 'High').length
  const medCount = data.filter((d) => d.risk_level === 'Moderate').length
  const lowCount = data.filter((d) => d.risk_level === 'Low').length

  // 3. Average risk score
  const avgScore =
    data.reduce((sum, d) => sum + d.prob_hybrid, 0) /
    Math.max(1, totalRegions)

  // 4. Highest-risk region
  const topRegion = [...data]
    .sort((a, b) => b.prob_hybrid - a.prob_hybrid)[0] || {}

  // Data for charts
  const distributionData = [
    { level: 'High', count: highCount },
    { level: 'Moderate', count: medCount },
    { level: 'Low', count: lowCount },
  ]
  const top5Data = [...data]
    .sort((a, b) => b.prob_hybrid - a.prob_hybrid)
    .slice(0, 5)
    .map((d) => ({ region: d.region, score: d.prob_hybrid }))

  return (
    <>
      {/* Top banner showing the absolute highest-risk region */}
      <Banner
        level={topRegion.risk_level}
        title={`Highest Risk: ${topRegion.region} (${topRegion.risk_level})`}
      >
        Current top flood-risk region based on ML model.
      </Banner>

      {/* Four key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<UsersIcon className="w-8 h-8 text-blue-500" />}
          title="Regions Monitored"
          value={totalRegions}
        />
        <MetricCard
          icon={<FireIcon className="w-8 h-8 text-red-500" />}
          title="High-Risk Regions"
          value={highCount}
        />
        <MetricCard
          icon={
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
          }
          title="Moderate-Risk Regions"
          value={medCount}
        />
        <MetricCard
          icon={<ChartBarIcon className="w-8 h-8 text-green-500" />}
          title="Avg. Risk Score"
          value={avgScore.toFixed(2)}
        />
      </div>

      {/* Two side-by-side charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Risk Level Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distributionData}>
              <XAxis dataKey="level" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 5 High-Risk Regions">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={top5Data}>
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip formatter={(val) => val.toFixed(2)} />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Commentary panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Risk Assessment Details">
          <p className="text-gray-600 dark:text-gray-300">
            The ML-driven model processes 12 hydrometeorological features and
            fuzzy logic to compute a probability score (“prob_hybrid”) between
            0 and 1 for each region, which is then bucketed into Low, Moderate,
            or High alert levels.
          </p>
        </ChartCard>
      </div>
    </>
  )
}
