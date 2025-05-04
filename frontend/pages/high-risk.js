// pages/high-risk.js
import { useQuery } from 'react-query';
import api from '../components/api';
import ChartCard from '../components/ChartCard';

export default function HighRisk() {
  const { data, isLoading, error } = useQuery('forecastAll', api.getLatest);

  if (isLoading) return <p>Loading high-risk regions…</p>;
  if (error) return <p>Error loading data</p>;

  // filter only Moderate & High
  const highRisk = data.filter(
    (f) => f.risk_level === 'High' || f.risk_level === 'Moderate'
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">High-Risk Region Analysis</h1>
      <p className="text-gray-600 mb-4">
        Regions with elevated flood risks based on ML predictions
      </p>

      <ChartCard title="Kyrgyzstan Regions Risk Map" />

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Region</th>
              <th className="px-4 py-2 text-left">Risk Level</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {highRisk.map((f) => (
              <tr key={f.region}>
                <td className="px-4 py-2">{f.region}</td>
                <td className="px-4 py-2">{f.risk_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
