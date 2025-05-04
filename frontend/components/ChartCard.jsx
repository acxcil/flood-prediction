// components/ChartCard.jsx
export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5 w-full">
      <p className="text-lg font-medium mb-4">{title}</p>
      <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
        {children || `${title} Chart Placeholder`}
      </div>
    </div>
  );
}
