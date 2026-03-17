import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const monthlyProfitData = [
  { month: 'Jan', profit: 17000 },
  { month: 'Feb', profit: 21000 },
  { month: 'Mar', profit: 19000 },
  { month: 'Apr', profit: 26000 },
  { month: 'May', profit: 23000 },
  { month: 'Jun', profit: 29000 },
];

export function EventPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyProfitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Net Profit" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
