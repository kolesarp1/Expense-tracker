'use client';

import { useMemo } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency, calculateSummary, getCategoryColor, getCategoryIcon, exportToCSV, formatDate } from '@/lib/utils';
import SpendingChart from './SpendingChart';
import CategoryChart from './CategoryChart';

interface DashboardProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
}

export default function Dashboard({ expenses, onEditExpense }: DashboardProps) {
  const summary = useMemo(() => calculateSummary(expenses), [expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const handleExportAll = () => {
    exportToCSV(expenses);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(summary.totalSpending)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(summary.monthlySpending)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary.topCategory ? (
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(summary.topCategory)}</span>
                    <span className="text-lg">{summary.topCategory}</span>
                  </span>
                ) : (
                  <span className="text-lg text-gray-400">No data</span>
                )}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Spending by Category">
          {expenses.length > 0 ? (
            <CategoryChart categoryBreakdown={summary.categoryBreakdown} />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No expenses to display</p>
            </div>
          )}
        </Card>

        <Card title="Spending Trend">
          {expenses.length > 0 ? (
            <SpendingChart expenses={expenses} />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No expenses to display</p>
            </div>
          )}
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card title="Category Breakdown">
        <div className="space-y-4">
          {Object.entries(summary.categoryBreakdown)
            .filter(([_, amount]) => amount > 0)
            .sort(([_, a], [__, b]) => b - a)
            .map(([category, amount]) => {
              const percentage = summary.totalSpending > 0 ? (amount / summary.totalSpending) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(category as ExpenseCategory)}</span>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getCategoryColor(category as ExpenseCategory),
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{percentage.toFixed(1)}% of total spending</p>
                </div>
              );
            })}
          {Object.values(summary.categoryBreakdown).every(amount => amount === 0) && (
            <div className="text-center py-12 text-gray-400">
              <p>No expenses to display</p>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Expenses */}
      <Card title="Recent Expenses">
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onEditExpense(expense)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-gray-500">{expense.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No expenses yet. Add your first expense to get started!</p>
          </div>
        )}
      </Card>

      {/* Export Button */}
      {expenses.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleExportAll} variant="primary">
            Export All Expenses
          </Button>
        </div>
      )}
    </div>
  );
}
