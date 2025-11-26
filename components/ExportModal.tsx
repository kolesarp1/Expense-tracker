'use client';

import { useState, useMemo, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Select from './ui/Select';
import Input from './ui/Input';
import { Expense, ExpenseCategory } from '@/types/expense';
import { performExport, ExportFormat } from '@/lib/exportUtils';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, getCategoryIcon } from '@/lib/utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export default function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expenses-export');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormat('csv');
      setFilename(`expenses-export-${new Date().toISOString().split('T')[0]}`);
      setStartDate('');
      setEndDate('');
      setSelectedCategories([]);
      setShowPreview(false);
    }
  }, [isOpen]);

  // Filter expenses based on selected criteria
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Date range filter
      if (startDate && expense.date < startDate) return false;
      if (endDate && expense.date > endDate) return false;

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(expense.category)) {
        return false;
      }

      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses, startDate, endDate, selectedCategories]);

  // Calculate export statistics
  const exportStats = useMemo(() => {
    const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown: Record<string, number> = {};

    filteredExpenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + 1;
    });

    return {
      totalRecords: filteredExpenses.length,
      totalAmount,
      categoryBreakdown,
      dateRange: filteredExpenses.length > 0
        ? `${formatDate(filteredExpenses[0].date)} - ${formatDate(filteredExpenses[filteredExpenses.length - 1].date)}`
        : 'N/A',
    };
  }, [filteredExpenses]);

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === EXPENSE_CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...EXPENSE_CATEGORIES]);
    }
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to export with the selected filters.');
      return;
    }

    setIsExporting(true);

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      performExport({
        format,
        filename,
        expenses: filteredExpenses,
      });

      // Success feedback
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Expenses" size="xl">
      <div className="p-6 space-y-6">
        {/* Export Options Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Export Settings */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Settings</h3>

              {/* Format Selection */}
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFormat('csv')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      format === 'csv'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">CSV</div>
                    <div className="text-xs text-gray-500">Spreadsheet</div>
                  </button>
                  <button
                    onClick={() => setFormat('json')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      format === 'json'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">JSON</div>
                    <div className="text-xs text-gray-500">Data</div>
                  </button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      format === 'pdf'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">PDF</div>
                    <div className="text-xs text-gray-500">Report</div>
                  </button>
                </div>
              </div>

              {/* Filename Input */}
              <div className="space-y-2">
                <label htmlFor="filename" className="block text-sm font-medium text-gray-700">
                  Filename
                </label>
                <Input
                  id="filename"
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Enter filename"
                />
                <p className="text-xs text-gray-500">
                  File will be saved as: <span className="font-mono">{filename}.{format}</span>
                </p>
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Clear date range
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <button
                  onClick={handleSelectAllCategories}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedCategories.length === EXPENSE_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EXPENSE_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`p-3 border-2 rounded-lg transition-all text-left ${
                      selectedCategories.includes(category)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(category)}</span>
                      <span className="font-medium text-sm">{category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Preview */}
          <div className="space-y-6">
            {/* Export Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Records:</span>
                  <span className="font-bold text-xl text-gray-900">{exportStats.totalRecords}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-xl text-green-600">{formatCurrency(exportStats.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date Range:</span>
                  <span className="font-medium text-sm text-gray-900">{exportStats.dateRange}</span>
                </div>
                {Object.keys(exportStats.categoryBreakdown).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm text-gray-600 mb-2">By Category:</div>
                    <div className="space-y-1">
                      {Object.entries(exportStats.categoryBreakdown).map(([category, count]) => (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span>{getCategoryIcon(category as ExpenseCategory)}</span>
                            {category}
                          </span>
                          <span className="font-medium">{count} records</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Toggle */}
            <div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <span className="font-semibold text-gray-900">
                  {showPreview ? 'Hide Preview' : 'Show Data Preview'}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${showPreview ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Preview Table */}
              {showPreview && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Category</th>
                          <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredExpenses.slice(0, 10).map((expense, index) => (
                          <tr key={expense.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 text-gray-900">{formatDate(expense.date)}</td>
                            <td className="px-4 py-2">
                              <span className="flex items-center gap-1">
                                {getCategoryIcon(expense.category)}
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right font-medium text-gray-900">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredExpenses.length > 10 && (
                    <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
                      Showing first 10 of {filteredExpenses.length} records
                    </div>
                  )}
                  {filteredExpenses.length === 0 && (
                    <div className="bg-gray-50 px-4 py-8 text-center text-gray-500">
                      No expenses match your filters
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {filteredExpenses.length === 0 ? (
              <span className="text-red-600 font-medium">No data to export with current filters</span>
            ) : (
              <span>Ready to export {filteredExpenses.length} record{filteredExpenses.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" disabled={isExporting}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              variant="primary"
              disabled={isExporting || filteredExpenses.length === 0}
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </span>
              ) : (
                `Export as ${format.toUpperCase()}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
