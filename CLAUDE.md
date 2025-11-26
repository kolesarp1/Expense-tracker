# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern, professional expense tracking web application built with Next.js 14. It helps users manage their personal finances by tracking expenses, visualizing spending patterns, and generating reports.

## Technology Stack

- **Framework**: Next.js 14.2.18 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Charts**: Recharts 2.12.7
- **Date Handling**: date-fns 3.0.0
- **Data Storage**: localStorage (browser-based persistence)
- **Package Manager**: npm

## Project Structure

```
expense-tracker/
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles with Tailwind directives
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page with expense management
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── CategoryChart.tsx    # Pie chart for category breakdown
│   ├── Dashboard.tsx        # Dashboard with analytics
│   ├── ExpenseForm.tsx      # Form for adding/editing expenses
│   ├── ExpenseList.tsx      # List view with filters
│   └── SpendingChart.tsx    # Line chart for spending trends
├── lib/                     # Utility functions and services
│   ├── storage.ts           # localStorage operations
│   └── utils.ts             # Helper functions and formatters
├── types/                   # TypeScript type definitions
│   └── expense.ts           # Expense-related types
└── public/                  # Static assets

```

## Architecture Components

### Data Layer
- **localStorage**: Client-side data persistence using browser's localStorage API
- **Storage Service** (`lib/storage.ts`): CRUD operations for expense data
- **Type Safety**: Full TypeScript type definitions for all data structures

### Business Logic
- **Expense Management**: Create, read, update, and delete expenses
- **Filtering**: Filter by date range, category, and search query
- **Analytics**: Calculate spending summaries, category breakdowns, and trends
- **Export**: CSV export functionality for data portability

### User Interface
- **Dashboard Tab**: Summary cards, charts, category breakdown, and recent expenses
- **Expenses Tab**: Add/edit form and filterable expense list
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Modern UI**: Clean, professional design with intuitive navigation

### Categorization
Six expense categories with unique icons and colors:
- Food 🍔
- Transportation 🚗
- Entertainment 🎬
- Shopping 🛍️
- Bills 📄
- Other 💰

### Reporting
- Total spending across all time
- Monthly spending for current month
- Top spending category
- Category breakdown with percentages
- Spending trend chart (3-month view)
- Category distribution pie chart
- Recent expenses list

## Features

✅ Add expenses with date, amount, category, and description
✅ Edit and delete existing expenses
✅ Form validation for all inputs
✅ Filter expenses by date range, category, and search query
✅ Dashboard with spending analytics
✅ Visual charts for spending patterns
✅ CSV export for expenses
✅ Responsive mobile design
✅ localStorage data persistence
✅ Professional, modern UI

## Commands

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Access the application at http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## Development Notes

- The application uses client-side rendering for all interactive components
- Data is persisted in localStorage, so it's specific to each browser/device
- All currency is formatted as USD
- Dates are handled using date-fns for reliable parsing and formatting
- The application is fully responsive and works on mobile, tablet, and desktop
- TypeScript provides full type safety across the application
