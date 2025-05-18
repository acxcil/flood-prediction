import {
  UsersIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

const ICONS = {
  users: UsersIcon,
  fire: FireIcon,
  exclamation: ExclamationTriangleIcon,
  chart: ChartBarIcon,
}

export default function MetricCard({ title, value, icon }) {
  const Icon = ICONS[icon]

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center">
      {Icon && <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />}
      <div className="ml-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  )
}
