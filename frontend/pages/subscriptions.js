// pages/subscriptions.js
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getToken } from '../utils/auth'
import api from '../components/api'

export default function Subscriptions() {
  const token = getToken()
  const qc = useQueryClient()

  const { data: regions = [], isLoading: rLoading } = useQuery(
    'regions',
    api.getRegions
  )
  const { data: subs = [], isLoading: sLoading } = useQuery(
    'subs',
    () => api.getSubscriptions(token),
    { enabled: !!token }
  )

  const subscribe = useMutation(
    region => api.subscribe(region, token),
    { onSuccess: () => qc.invalidateQueries('subs') }
  )
  const unsubscribe = useMutation(
    id => api.unsubscribe(id, token),
    { onSuccess: () => qc.invalidateQueries('subs') }
  )

  if (rLoading || sLoading) return <p>Loading…</p>

  const isSubscribed = region =>
    subs.some(s => s.region === region)

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        My Alert Subscriptions
      </h1>

      <ul className="space-y-2">
        {subs.map(s => (
          <li key={s.id} className="flex justify-between">
            <span className="capitalize text-gray-900 dark:text-gray-100">
              {s.region}
            </span>
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
        <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
          Add More Regions
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {regions
            .filter(r => !isSubscribed(r.name))
            .map(r => (
              <button
                key={r.id}
                onClick={() => subscribe.mutate(r.name)}
                className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                {r.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
