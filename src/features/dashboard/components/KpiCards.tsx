import { ArrowUpRight, ArrowDownRight, Target, TrendingUp as ProfitIcon, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const kpiTarget = 300000000;
const kpiAchieved = 285000000;
export const kpiPercentage = Math.round((kpiAchieved / kpiTarget) * 100);

const profitTarget = 150000000;
const profitAchieved = 142000000;
export const profitPercentage = Math.round((profitAchieved / profitTarget) * 100);

const kpis = [
  {
    title: 'KPI (tháng này)',
    value: `${kpiPercentage}%`,
    subValue: `${(kpiAchieved / 1000000).toFixed(0)}tr / ${(kpiTarget / 1000000).toFixed(0)}tr VNĐ`,
    change: kpiPercentage >= 100 ? 'Đã hoàn thành' : `Còn ${(kpiTarget - kpiAchieved) / 1000000}tr`,
    trend: kpiPercentage >= 100 ? 'up' : 'down',
    icon: Target,
    color: kpiPercentage >= 100 ? 'text-green-600' : 'text-blue-600',
    bgColor: kpiPercentage >= 100 ? 'bg-green-100' : 'bg-blue-100',
    percentage: kpiPercentage,
  },
  {
    title: 'Lợi nhuận',
    value: `${profitPercentage}%`,
    subValue: `${(profitAchieved / 1000000).toFixed(0)}tr / ${(profitTarget / 1000000).toFixed(0)}tr VNĐ`,
    change: profitPercentage >= 100 ? 'Vượt mục tiêu' : `Còn ${100 - profitPercentage}%`,
    trend: profitPercentage >= 90 ? 'up' : 'down',
    icon: ProfitIcon,
    color: profitPercentage >= 100 ? 'text-green-600' : profitPercentage >= 90 ? 'text-yellow-600' : 'text-orange-600',
    bgColor: profitPercentage >= 100 ? 'bg-green-100' : profitPercentage >= 90 ? 'bg-yellow-100' : 'bg-orange-100',
    percentage: profitPercentage,
  },
  {
    title: 'Sự kiện tháng này',
    value: '24',
    change: '+5.4%',
    trend: 'up',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-3xl font-bold">{kpi.value}</p>
                {kpi.subValue && <p className="text-xs text-gray-500">{kpi.subValue}</p>}
                {kpi.percentage !== undefined && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        kpi.percentage >= 100 ? 'bg-green-600' : kpi.percentage >= 90 ? 'bg-yellow-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-orange-600" />
                  )}
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
