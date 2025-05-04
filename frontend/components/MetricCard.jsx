// components/MetricCard.jsx
export default function MetricCard({ icon, title, value, subtitle }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5 flex-1">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      {subtitle && <p className="mt-2 text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}
