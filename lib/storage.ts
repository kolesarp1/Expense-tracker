import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

export const getExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

export const saveExpense = (expense: Omit<Expense, 'id'>): Expense => {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: generateId(),
  };

  expenses.push(newExpense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

  return newExpense;
};

export const updateExpense = (id: string, updatedData: Omit<Expense, 'id'>): Expense => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) {
    throw new Error('Expense not found');
  }

  const updatedExpense: Expense = {
    ...updatedData,
    id,
  };

  expenses[index] = updatedExpense;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

  return updatedExpense;
};

export const deleteExpense = (id: string): void => {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredExpenses));
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
