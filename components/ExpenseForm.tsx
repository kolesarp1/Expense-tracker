'use client';

import { useState, useEffect } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { Expense, ExpenseCategory } from '@/types/expense';
import { EXPENSE_CATEGORIES } from '@/lib/utils';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
}

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food' as ExpenseCategory,
    description: '',
  });

  const [errors, setErrors] = useState({
    date: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        description: editingExpense.description,
      });
    }
  }, [editingExpense]);

  const validateForm = (): boolean => {
    const newErrors = {
      date: '',
      amount: '',
      description: '',
    };

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    });

    if (!editingExpense) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food',
        description: '',
      });
    }

    setErrors({ date: '', amount: '', description: '' });
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'Food',
      description: '',
    });
    setErrors({ date: '', amount: '', description: '' });
    onCancelEdit?.();
  };

  return (
    <Card title={editingExpense ? 'Edit Expense' : 'Add New Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          max={new Date().toISOString().split('T')[0]}
        />

        <Input
          type="number"
          label="Amount"
          placeholder="0.00"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
          options={EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="What did you spend on?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </Button>
          {editingExpense && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
