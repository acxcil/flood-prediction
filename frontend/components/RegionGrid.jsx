import RegionCard from './RegionCard';

export default function RegionGrid({ forecasts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {forecasts.map((f) => (
        <RegionCard key={f.region} forecast={f} />
      ))}
    </div>
  );
}
