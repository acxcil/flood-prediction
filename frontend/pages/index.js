import { useQuery } from 'react-query'
import { useTheme } from 'next-themes'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import api from '../components/api'
import Banner from '../components/Banner'
import MetricCard from '../components/MetricCard'
import ChartCard from '../components/ChartCard'

export default function Home() {
  const { theme } = useTheme()
  const { data: latest = [], isLoading } = useQuery('latest', api.getLatest)
  const { data: regions = [] }           = useQuery('regions', api.getRegions)

  if (isLoading) return <p>Loading…</p>

  // Highest‐risk banner
  const sorted = [...latest].sort((a,b)=>b.prob_hybrid-a.prob_hybrid)
  const top    = sorted[0] || { region:'N/A', risk_level:'Low', prob_hybrid:0 }

  // Metrics
  const total = regions.length
  const high  = latest.filter(f=>f.risk_level==='High').length
  const mid   = latest.filter(f=>f.risk_level==='Moderate').length
  const avg   = (latest.reduce((s,f)=>s+f.prob_hybrid,0)/latest.length).toFixed(2)

  // Distribution
  const dist = ['Low','Moderate','High'].map(l=>({
    level:l, count: latest.filter(f=>f.risk_level===l).length
  }))

  // Color map
  const colors = { Low:'#38A169', Moderate:'#D69E2E', High:'#E53E3E' }

  return (
    <>
      <Banner level={top.risk_level} region={top.region} score={top.prob_hybrid} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Regions Monitored"    value={total} icon="users" />
        <MetricCard title="High-Risk Regions"     value={high}  icon="fire"  />
        <MetricCard title="Moderate-Risk Regions" value={mid}   icon="exclamation" />
        <MetricCard title="Avg. Risk Score"       value={avg}   icon="chart" />
      </div>

      <ChartCard title="Risk Level Distribution">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dist}>
            <XAxis dataKey="level" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {dist.map(d=>(
                <Cell key={d.level} fill={colors[d.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}
