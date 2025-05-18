// pages/about.js
import RiskDetails from '../components/RiskDetails'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">How It Works</h1>
      <p className="text-gray-600">
        Our ML-driven flood prediction system combines fuzzy logic and a LightGBM classifier 
        over 12 hydrometeorological features to give you regional risk scores...
      </p>
      <RiskDetails />
      {/* You can expand here with diagrams, equations, links to docs, etc. */}
    </div>
  )
}
