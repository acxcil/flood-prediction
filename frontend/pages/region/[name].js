import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import api from '../../components/api';
import Chart from '../../components/Chart';

export default function RegionPage() {
  const router = useRouter();
  const { name } = router.query;

  const { data, isLoading, error } = useQuery(
    ['hist', name],
    () => api.getHistory(name),
    { enabled: !!name }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading history</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Historical Risk: {name}</h2>
      <Chart data={data} />
    </div>
  );
}
