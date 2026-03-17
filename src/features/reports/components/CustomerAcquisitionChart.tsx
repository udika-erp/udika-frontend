import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const eventTypeRevenueData = [
  { name: 'Wedding', value: 180000, color: '#8b5cf6' },
  { name: 'Corporate', value: 135000, color: '#3b82f6' },
  { name: 'Birthday', value: 45000, color: '#10b981' },
  { name: 'Charity', value: 60000, color: '#f59e0b' },
];

export function CustomerAcquisitionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Event Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={eventTypeRevenueData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={(entry) => `$${(entry.value / 1000).toFixed(0)}k`}
            >
              {eventTypeRevenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {eventTypeRevenueData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="font-medium">${(item.value / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
