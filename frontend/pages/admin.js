import { useState } from 'react';
import api from '../components/api';
import { getToken } from '../utils/auth';

export default function Admin() {
  const token = getToken();
  const [days, setDays] = useState(30);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Admin Panel</h2>
      <button
        onClick={() => api.ingest(token)}
        className="mr-2 p-2 bg-green-500 text-white rounded"
      >
        Trigger Ingest
      </button>
      <input
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        className="p-1 border rounded w-20 mr-2"
      />
      <button
        onClick={() => api.cleanup(token, days)}
        className="p-2 bg-yellow-500 text-white rounded"
      >
        Cleanup {days}d
      </button>
    </div>
  );
}
