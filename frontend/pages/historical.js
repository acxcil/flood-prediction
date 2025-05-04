// pages/historical.js
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from '../components/api';
import ChartCard from '../components/ChartCard';
import Chart from '../components/Chart';

export default function Historical() {
  // 1) Fetch all regions
  const {
    data: regions = [],
    isLoading: regLoading,
    error: regError,
  } = useQuery('regions', api.getRegions);

  // 2) Local state for the selected region ID (route param) and its display name
  const [regionId, setRegionId]     = useState('');
  const [regionName, setRegionName] = useState('');

  // 3) Date pickers (use your existing min/max logic or the 30-day default)
  const today      = new Date().toISOString().split('T')[0];
  const defaultAgo = new Date(Date.now() - 29*24*60*60*1000)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(defaultAgo);
  const [endDate,   setEndDate]   = useState(today);

  // 4) When regions load, default to the first one
  useEffect(() => {
    if (regions.length && !regionId) {
      setRegionId(regions[0].id);
      setRegionName(regions[0].name);
    }
  }, [regions, regionId]);

  // 5) Fetch history for the chosen ID & range
  const {
    data: history = [],
    isLoading: histLoading,
    error: histError,
  } = useQuery(
    ['history', regionId, startDate, endDate],
    () => api.getHistoryByRange(regionId, startDate, endDate),
    { enabled: Boolean(regionId && startDate && endDate) }
  );

  if (regLoading) return <p>Loading regions…</p>;
  if (regError)   return <p>Error loading regions</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Historical Flood Data</h1>
      <p className="text-gray-600 mb-4">
        Showing model risk vs. actual status for <strong>{regionName}</strong>.
      </p>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* Region selector */}
        <div>
          <label htmlFor="region" className="block font-medium">Region:</label>
          <select
            id="region"
            className="mt-1 p-2 border rounded"
            value={regionId}
            onChange={(e) => {
              const sel = regions.find(r => r.id === e.target.value);
              setRegionId(e.target.value);
              setRegionName(sel?.name || e.target.value);
            }}
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start date */}
        <div>
          <label htmlFor="startDate" className="block font-medium">From:</label>
          <input
            id="startDate"
            type="date"
            className="mt-1 p-2 border rounded"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End date */}
        <div>
          <label htmlFor="endDate" className="block font-medium">To:</label>
          <input
            id="endDate"
            type="date"
            className="mt-1 p-2 border rounded"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Chart */}
      {histLoading ? (
        <p>Loading historical data…</p>
      ) : histError ? (
        <p>Error loading data for {regionName}</p>
      ) : (
        <ChartCard title={`Risk & Actual Status — ${regionName}`}>
          <Chart data={history} />
        </ChartCard>
      )}
    </div>
  );
}
