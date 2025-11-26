// Seed script to add initial expenses
// Run this in your browser console while the app is running at localhost:3000

const STORAGE_KEY = 'expense-tracker-data';

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const seedExpenses = [
  {
    id: generateId(),
    date: '2025-10-01',
    amount: 5,
    category: 'Bills',
    description: 'xAI credits'
  },
  {
    id: generateId(),
    date: '2025-11-01',
    amount: 20,
    category: 'Bills',
    description: 'Claude Pro subscription'
  }
];

// Get existing expenses
const existingData = localStorage.getItem(STORAGE_KEY);
const existingExpenses = existingData ? JSON.parse(existingData) : [];

// Add seed expenses
const allExpenses = [...existingExpenses, ...seedExpenses];
localStorage.setItem(STORAGE_KEY, JSON.stringify(allExpenses));

console.log('✅ Seed data added successfully!');
console.log('Added expenses:', seedExpenses);
console.log('Total expenses:', allExpenses.length);

// Reload the page to see the changes
window.location.reload();
