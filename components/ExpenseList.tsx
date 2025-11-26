'use client';

import { useState, useMemo } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency, formatDate, filterExpenses, exportToCSV, EXPENSE_CATEGORIES, getCategoryIcon } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, {
      startDate,
      endDate,
      category: selectedCategory,
      searchQuery,
    });
  }, [expenses, startDate, endDate, selectedCategory, searchQuery]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredExpenses]);

  const handleExport = () => {
    exportToCSV(filteredExpenses);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <Card title="Expense List">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'All')}
            options={[
              { value: 'All', label: 'All Categories' },
              ...EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {sortedExpenses.length} of {expenses.length} expenses
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button variant="primary" size="sm" onClick={handleExport} disabled={sortedExpenses.length === 0}>
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No expenses found</p>
            <p className="text-gray-400 text-sm mt-1">
              {expenses.length === 0 ? 'Add your first expense to get started' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit expense"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
