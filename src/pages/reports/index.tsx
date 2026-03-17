import { useState } from 'react';
import { Download, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RevenueChart } from '@/features/reports/components/RevenueChart';
import { CustomerAcquisitionChart } from '@/features/reports/components/CustomerAcquisitionChart';
import { EventPerformanceChart } from '@/features/reports/components/EventPerformanceChart';

const topClientsData = [
  { name: 'Tech Corp Inc', revenue: 125000, events: 8 },
  { name: 'David Park', revenue: 68000, events: 5 },
  { name: 'Sarah Johnson', revenue: 45000, events: 3 },
  { name: 'Local Foundation', revenue: 38000, events: 2 },
  { name: 'Michael Smith', revenue: 28000, events: 4 },
];

const recentTransactions = [
  { id: 1, date: '2026-02-20', description: 'Johnson Wedding - Deposit', type: 'income', amount: 5000 },
  { id: 2, date: '2026-02-18', description: 'Catering Services - Invoice', type: 'expense', amount: 3200 },
  { id: 3, date: '2026-02-17', description: 'Tech Corp Gala - Payment', type: 'income', amount: 12000 },
  { id: 4, date: '2026-02-15', description: 'Equipment Rental', type: 'expense', amount: 1800 },
  { id: 5, date: '2026-02-14', description: 'Martinez Wedding - Final Payment', type: 'income', amount: 8000 },
];

export function Reports() {
  const [reportPeriod, setReportPeriod] = useState('6months');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track performance and analyze business metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">$328K</p>
                <p className="text-sm text-green-600 mt-1">+15.3%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold mt-1">$193K</p>
                <p className="text-sm text-red-600 mt-1">+8.2%</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold mt-1">$135K</p>
                <p className="text-sm text-green-600 mt-1">+24.1%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Events Completed</p>
                <p className="text-2xl font-bold mt-1">38</p>
                <p className="text-sm text-green-600 mt-1">+12.5%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <CustomerAcquisitionChart />
      </div>

      <EventPerformanceChart />

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top Clients by Revenue</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Events</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClientsData.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-right">{client.events}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ${client.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">{transaction.date}</TableCell>
                    <TableCell className="text-sm">{transaction.description}</TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
