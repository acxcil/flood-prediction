import { useQuery, useMutation } from 'react-query';
import api from '../components/api';
import { getToken } from '../utils/auth';

export default function Subscriptions() {
  const token = getToken();
  const { data, isLoading, refetch } = useQuery('subs', () =>
    api.getSubscriptions(token)
  );

  const unsubscribe = useMutation((id) => api.unsubscribe(id, token), {
    onSuccess: refetch,
  });
  const subscribe = useMutation((region) => api.subscribe(region, token), {
    onSuccess: refetch,
  });

  if (isLoading) return <p>Loading subscriptions...</p>;

  return (
    <div>
      <h2 className="text-2xl mb-4">My Subscriptions</h2>
      <ul className="mb-4">
        {data.map((s) => (
          <li key={s.id} className="flex justify-between mb-2">
            {s.region}
            <button
              onClick={() => unsubscribe.mutate(s.id)}
              className="text-red-500"
            >
              Unsubscribe
            </button>
          </li>
        ))}
      </ul>
      <div>
        <select
          onChange={(e) => subscribe.mutate(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Select region to subscribe</option>
          {data.available?.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
