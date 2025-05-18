export default function ChartCard({ title, children, className = '' }) {
  return (
    <div
      className={
        `bg-white dark:bg-gray-800 shadow rounded-lg p-4 ` +
        className
      }
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
