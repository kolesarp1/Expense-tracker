# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your expenses, visualize spending patterns, and manage your personal finances with ease.

## Features

- **Add & Manage Expenses**: Create, edit, and delete expenses with detailed information
- **Smart Filtering**: Filter expenses by date range, category, and search terms
- **Visual Analytics**: Interactive charts showing spending trends and category breakdowns
- **Dashboard Overview**: Quick summary cards displaying total spending, monthly totals, and top categories
- **Export Data**: Download your expenses as CSV for external analysis
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Persistent Storage**: All data is saved locally in your browser

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm (comes with Node.js)

### Installation

1. Clone this repository or download the source code

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Dashboard Tab

The Dashboard provides an overview of your finances:

- **Summary Cards**: View total spending, current month spending, and your top expense category
- **Spending Trend Chart**: Visualize your spending over the last 3 months
- **Category Breakdown**: See how much you've spent in each category with visual progress bars
- **Recent Expenses**: Quick access to your 5 most recent expenses
- **Export Button**: Download all your expenses as a CSV file

### Expenses Tab

Manage your expenses in detail:

**Adding an Expense:**
1. Fill in the expense form on the left:
   - **Date**: Select the date of the expense (defaults to today)
   - **Amount**: Enter the amount spent (e.g., 25.50)
   - **Category**: Choose from Food, Transportation, Entertainment, Shopping, Bills, or Other
   - **Description**: Add details about what you spent money on
2. Click "Add Expense" to save

**Editing an Expense:**
1. Click the edit icon (pencil) on any expense in the list
2. The form will populate with the expense data
3. Make your changes and click "Update Expense"
4. Click "Cancel" to discard changes

**Deleting an Expense:**
1. Click the delete icon (trash) on any expense
2. The expense will be removed immediately

**Filtering Expenses:**
- **Search**: Type in the search box to filter by description or category
- **Category**: Select a specific category or "All Categories"
- **Date Range**: Set start and/or end dates to filter by time period
- **Clear Filters**: Reset all filters to view all expenses
- **Export CSV**: Download the currently filtered expenses

## Data Storage

All expense data is stored in your browser's localStorage. This means:
- Your data is completely private and never leaves your device
- Data persists between sessions
- Each browser/device maintains its own separate data
- Clearing browser data will delete all expenses

## Categories

The app includes 6 expense categories:

- 🍔 **Food**: Groceries, restaurants, snacks
- 🚗 **Transportation**: Gas, public transit, parking
- 🎬 **Entertainment**: Movies, games, subscriptions
- 🛍️ **Shopping**: Clothing, electronics, household items
- 📄 **Bills**: Utilities, rent, insurance
- 💰 **Other**: Miscellaneous expenses

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Interactive charts and graphs
- **date-fns**: Date manipulation and formatting

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Browser Compatibility

The application works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips

- Add expenses regularly to keep track of your spending
- Use the date range filter to see spending for specific periods
- Export your data monthly to keep external backups
- Check the Dashboard regularly to monitor spending patterns
- Use descriptive names in the Description field for better searchability

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues or have suggestions, please open an issue in the project repository.

---

Built with ❤️ using Next.js and TypeScript
