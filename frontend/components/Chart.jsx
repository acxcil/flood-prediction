// components/Chart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Chart({ data }) {
  // Transform incoming API records into the shape Recharts needs:
  const chartData = data.map((d) => {
    // date field from your backend
    const date = d.forecast_date || d.date;
    // model probability
    const risk = d.prob_hybrid;
    // actual flood status: try various keys
    let status = null;
    if (d.flood_status !== undefined) {
      // if it's a bool or 'Flood' string, coerce to 1/0
      status =
        d.flood_status === true || d.flood_status === 'Flood' ? 1 : 0;
    } else if (d.actual_status !== undefined) {
      status = d.actual_status ? 1 : 0;
    }
    return { date, risk, status };
  });

  // Only draw the status line if at least one point has a non-null status
  const hasActual = chartData.some((pt) => pt.status !== null);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis domain={[0, 1]} />
        <Tooltip
          formatter={(val, name) => [
            name === 'risk'
              ? val.toFixed(2)
              : val === 1
              ? 'Flood'
              : 'No Flood',
            name === 'risk' ? 'Model Risk' : 'Actual Status',
          ]}
        />
        <Line
          type="monotone"
          dataKey="risk"
          name="Model Risk"
          dot={false}
        />
        {hasActual && (
          <Line
            type="monotone"
            dataKey="status"
            name="Actual Status"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
