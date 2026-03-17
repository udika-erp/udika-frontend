import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { kpiPercentage, profitPercentage } from './KpiCards';

const eventTypeData = [
  { name: 'Weddings', value: 45, color: '#8b5cf6', id: 'wedding' },
  { name: 'Corporate', value: 30, color: '#3b82f6', id: 'corporate' },
  { name: 'Birthday', value: 15, color: '#10b981', id: 'birthday' },
  { name: 'Other', value: 10, color: '#f59e0b', id: 'other' },
];

interface RevenueExpenseChartProps {
  displayMessage: string;
}

export function RevenueExpenseChart({ displayMessage }: RevenueExpenseChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Motivational Message */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[300px] text-center px-8">
            <div className="mb-6">
              {kpiPercentage >= 100 ? (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <Target className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{displayMessage}</h2>
            {kpiPercentage >= 100 ? (
              <p className="text-gray-600 text-lg">Bạn đã hoàn thành xuất sắc mục tiêu tháng này. Tiếp tục phát huy!</p>
            ) : (
              <p className="text-gray-600 text-lg">Còn {100 - kpiPercentage}% nữa để đạt mục tiêu. Cố lên, bạn làm được!</p>
            )}
            <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-md">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{kpiPercentage}%</p>
                <p className="text-xs text-gray-500 mt-1">KPI đạt được</p>
              </div>
              <div className="text-center border-l border-r border-gray-300">
                <p className="text-2xl font-bold text-green-600">{profitPercentage}%</p>
                <p className="text-xs text-gray-500 mt-1">Lợi nhuận</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-xs text-gray-500 mt-1">Sự kiện</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Loại sự kiện</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={eventTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {eventTypeData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {eventTypeData.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
