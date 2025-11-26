'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

interface SpendingChartProps {
  expenses: Expense[];
}

export default function SpendingChart({ expenses }: SpendingChartProps) {
  const now = new Date();
  const threeMonthsAgo = subMonths(now, 2);
  const startDate = startOfMonth(threeMonthsAgo);
  const endDate = endOfMonth(now);

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const dailySpending = allDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayExpenses = expenses.filter(expense => expense.date === dayStr);
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      date: format(day, 'MMM dd'),
      amount: total,
    };
  });

  const weeklyData = [];
  for (let i = 0; i < dailySpending.length; i += 7) {
    const weekData = dailySpending.slice(i, i + 7);
    const weekTotal = weekData.reduce((sum, day) => sum + day.amount, 0);
    if (weekData.length > 0) {
      weeklyData.push({
        date: weekData[0].date,
        amount: weekTotal,
      });
    }
  }

  if (weeklyData.length === 0 || weeklyData.every(d => d.amount === 0)) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No data available for the last 3 months</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={weeklyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
