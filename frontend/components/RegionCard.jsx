import Link from 'next/link';

export default function RegionCard({ forecast }) {
  const { region, prob_hybrid, risk_level } = forecast;

  // normalize to lowercase for mapping
  const level = (risk_level || '').toLowerCase();

  // explicit Tailwind classes so PurgeCSS can keep them
  const borderClass = {
    high: 'border-red-500',
    moderate: 'border-yellow-500',
    low: 'border-green-500',
  }[level] || 'border-gray-500';

  const textClass = {
    high: 'text-red-600',
    moderate: 'text-yellow-600',
    low: 'text-green-600',
  }[level] || 'text-gray-600';

  return (
    <Link
      href={`/region/${region}`}
      className={`block ${borderClass} rounded-lg p-4 hover:shadow-lg`}
    >
      <h3 className="font-bold text-lg">{region}</h3>
      <p>Score: {prob_hybrid !== undefined ? prob_hybrid.toFixed(2) : 'N/A'}</p>
      <p className={`font-semibold ${textClass}`}>
        {risk_level || 'N/A'}
      </p>
    </Link>
  );
}
