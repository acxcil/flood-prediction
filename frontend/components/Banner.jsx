// components/Banner.jsx
export default function Banner({ level, title, children }) {
  const colors = {
    low:      { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800' },
    moderate: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800' },
    high:     { bg: 'bg-red-50',   border: 'border-red-400',   text: 'text-red-800' },
  }[level?.toLowerCase()] || { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-800' };

  return (
    <div className={`border-l-4 ${colors.border} ${colors.bg} p-4 mb-6`}>
      <p className={`font-semibold ${colors.text}`}>{title}</p>
      <p className={`mt-1 ${colors.text}`}>{children}</p>
    </div>
  );
}
