export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
