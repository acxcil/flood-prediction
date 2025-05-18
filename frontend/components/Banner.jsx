// components/Banner.jsx
import { useTheme } from 'next-themes'

export default function Banner({ level, region, score }) {
  const { theme } = useTheme()
  const isLight  = theme === 'light'

  // choose base color by alert level
  const baseClasses =
    level === 'High'
      ? 'bg-red-600 text-white'
      : level === 'Moderate'
      ? 'bg-yellow-400 text-gray-900'
      : 'bg-green-600 text-white'

  return (
    <div className={`relative overflow-hidden rounded-lg ${baseClasses} p-6 mb-6`}>
      {/* light-mode wave SVG */}
      {isLight && (
        <svg
          viewBox="0 0 1200 100"
          className="absolute bottom-0 left-0 w-full h-20 opacity-30"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C300,80 900,0 1200,40 L1200,100 L0,100 Z"
            fill={ level === 'High' ? '#FECACA' /* red-200 */ 
              : level === 'Moderate' ? '#FEF3C7' /* yellow-100 */
              : '#D1FAE5' /* green-100 */ }
          />
        </svg>
      )}

      {/* content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-1">
          🚨 Highest Flood Risk
        </h2>
        <p className="text-lg">
          <strong className="capitalize">{region}</strong> – {level} ({(score*100).toFixed(1)}%)
        </p>
      </div>
    </div>
  )
}
