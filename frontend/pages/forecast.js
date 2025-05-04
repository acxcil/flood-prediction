// pages/forecast.js
import { useQuery } from 'react-query';
import api from '../components/api';

export default function Forecast() {
  const { data, isLoading, error } = useQuery('forecastAll', api.getLatest);

  if (isLoading) return <p>Loading forecasts…</p>;
  if (error) return <p>Error loading forecasts</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Latest Flood Forecasts</h1>
      <p className="text-gray-600 mb-4">
        ML-generated predictions based on meteorological and hydrological data
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Region</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Risk Level</th>
              <th className="px-4 py-2 text-left">Risk Score</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((f) => (
              <tr key={f.region}>
                <td className="px-4 py-2">{f.region}</td>
                <td className="px-4 py-2">{f.forecast_date}</td>
                <td className="px-4 py-2">{f.risk_level}</td>
                <td className="px-4 py-2">{f.prob_hybrid.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
