'use client';

import { useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency, getCategoryIcon, getCategoryColor } from '@/lib/utils';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, differenceInDays, startOfDay } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyInsightsProps {
  expenses: Expense[];
}

export default function MonthlyInsights({ expenses }: MonthlyInsightsProps) {
  // Calculate monthly data
  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    // Calculate category totals
    const categoryTotals: Record<ExpenseCategory, number> = {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    };

    monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] += expense.amount;
    });

    // Get top 3 categories
    const topCategories = (Object.entries(categoryTotals) as [ExpenseCategory, number][])
      .filter(([_, amount]) => amount > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3);

    // Prepare chart data
    const chartData = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        color: getCategoryColor(category as ExpenseCategory),
      }));

    return {
      topCategories,
      chartData,
      monthlyExpenses,
    };
  }, [expenses]);

  // Calculate budget streak (days without exceeding daily budget)
  const budgetStreak = useMemo(() => {
    const DAILY_BUDGET = 50; // $50 per day budget
    const now = new Date();
    const today = startOfDay(now);

    let streak = 0;
    let currentDate = today;

    // Go backwards from today, counting consecutive days under budget
    for (let i = 0; i < 365; i++) {
      const dayStart = startOfDay(new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000));
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

      const dayExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: dayStart, end: dayEnd });
      });

      const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      if (dayTotal <= DAILY_BUDGET) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [expenses]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Napkin-style container */}
      <div
        className="bg-amber-50 rounded-3xl shadow-2xl p-8 md:p-12 relative"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 92, 46, 0.03) 2px,
              rgba(139, 92, 46, 0.03) 4px
            )
          `,
        }}
      >
        {/* Coffee stain decoration */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 46, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Hand-drawn title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-center mb-8 relative"
          style={{
            fontFamily: '"Caveat", cursive',
            color: '#1f2937',
          }}
        >
          Monthly Insights
          <svg
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-2"
            viewBox="0 0 200 10"
          >
            <path
              d="M 0 5 Q 50 2, 100 5 T 200 5"
              stroke="#9ca3af"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
            />
          </svg>
        </h1>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Pie Chart Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {monthlyData.chartData.length > 0 ? (
                <>
                  <ResponsiveContainer width={300} height={300}>
                    <PieChart>
                      <Pie
                        data={monthlyData.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {monthlyData.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Hand-drawn arrow and label */}
                  <div
                    className="absolute -right-8 top-1/2 transform -translate-y-1/2"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    <svg width="120" height="60" viewBox="0 0 120 60" className="absolute -top-4">
                      <path
                        d="M 10 30 Q 40 20, 70 30"
                        stroke="#374151"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M 70 30 L 65 25 M 70 30 L 65 35"
                        stroke="#374151"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    <p className="text-xl mt-4 ml-16 whitespace-nowrap">donut chart!</p>
                  </div>

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-amber-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-600" style={{ fontFamily: '"Caveat", cursive' }}>
                        Spending
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  <p className="text-gray-400 text-center" style={{ fontFamily: '"Caveat", cursive' }}>
                    No expenses this month
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Top Categories Section */}
          <div className="space-y-6">
            {monthlyData.topCategories.length > 0 ? (
              <>
                {monthlyData.topCategories.map(([category, amount], index) => {
                  const colors = [
                    'border-l-red-400 bg-red-50',
                    'border-l-teal-400 bg-teal-50',
                    'border-l-blue-400 bg-blue-50',
                  ];

                  return (
                    <div
                      key={category}
                      className={`border-l-8 ${colors[index]} p-4 rounded-r-lg transform hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getCategoryIcon(category)}</span>
                        <div className="flex-1">
                          <p
                            className="text-xl font-bold"
                            style={{ fontFamily: '"Caveat", cursive' }}
                          >
                            {category}: {formatCurrency(amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Top 3 label */}
                {monthlyData.topCategories.length === 3 && (
                  <div className="relative">
                    <svg width="100" height="80" className="absolute -right-4 -top-32" viewBox="0 0 100 80">
                      <path
                        d="M 50 10 L 50 60"
                        stroke="#374151"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M 50 60 L 45 55 M 50 60 L 55 55"
                        stroke="#374151"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    <p
                      className="absolute -right-4 -top-20 text-lg whitespace-nowrap"
                      style={{ fontFamily: '"Caveat", cursive' }}
                    >
                      Top 3!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400" style={{ fontFamily: '"Caveat", cursive' }}>
                  No expenses to show yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Streak Section */}
        <div className="mt-12">
          <div
            className="border-4 border-dashed border-gray-800 rounded-2xl p-8 bg-white/50 relative"
            style={{
              transform: 'rotate(-0.5deg)',
            }}
          >
            <h2
              className="text-3xl font-bold text-center mb-4"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              Budget Streak
            </h2>

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div
                  className="text-7xl md:text-8xl font-bold text-green-600"
                  style={{ fontFamily: '"Caveat", cursive' }}
                >
                  {budgetStreak}
                </div>
                <p
                  className="text-2xl md:text-3xl mt-2"
                  style={{ fontFamily: '"Caveat", cursive' }}
                >
                  days!
                </p>
              </div>

              {/* Progress bar sketch */}
              <div className="hidden md:block">
                <div className="w-32 h-12 border-3 border-gray-400 rounded-full relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((budgetStreak / 30) * 100, 100)}%`,
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 20px
                      )`
                    }}
                  />
                </div>
              </div>
            </div>

            <p
              className="text-center mt-4 text-gray-600 text-lg"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              Consecutive days staying under $50/day budget
            </p>
          </div>
        </div>

        {/* Fun stats */}
        {monthlyData.monthlyExpenses.length > 0 && (
          <div className="mt-8 text-center">
            <p
              className="text-xl text-gray-600"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              You made {monthlyData.monthlyExpenses.length} purchases this month!
            </p>
          </div>
        )}
      </div>

      {/* Add Google Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}
