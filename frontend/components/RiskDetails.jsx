// components/RiskDetails.jsx
import {
    SparklesIcon,
    AcademicCapIcon,
    ChartBarIcon,
  } from '@heroicons/react/24/outline'
  
  export default function RiskDetails() {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          How It Works
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <SparklesIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <p className="ml-3 text-gray-700 dark:text-gray-300">
              Compute <strong>12 hydrometeorological features</strong> (rainfall, terrain, NDVI, etc.).
            </p>
          </li>
          <li className="flex items-start">
            <AcademicCapIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <p className="ml-3 text-gray-700 dark:text-gray-300">
              Run a <strong>hybrid fuzzy + LightGBM model</strong> for flood probability.
            </p>
          </li>
          <li className="flex items-start">
            <ChartBarIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
            <p className="ml-3 text-gray-700 dark:text-gray-300">
              Bucket probabilities into <strong>Low, Moderate,</strong> or <strong>High</strong> alerts.
            </p>
          </li>
        </ul>
      </div>
    )
  }
  