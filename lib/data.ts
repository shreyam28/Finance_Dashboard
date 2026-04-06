import type { Transaction, BalanceData, CategoryData } from './types'

export const transactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: '2', date: '2026-04-02', amount: 85, category: 'Food & Dining', type: 'expense', description: 'Grocery shopping' },
  { id: '3', date: '2026-04-03', amount: 120, category: 'Transportation', type: 'expense', description: 'Gas refill' },
  { id: '4', date: '2026-04-04', amount: 250, category: 'Shopping', type: 'expense', description: 'New headphones' },
  { id: '5', date: '2026-04-05', amount: 800, category: 'Freelance', type: 'income', description: 'Design project' },
  { id: '6', date: '2026-04-06', amount: 150, category: 'Bills & Utilities', type: 'expense', description: 'Electricity bill' },
  { id: '7', date: '2026-04-07', amount: 65, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
  { id: '8', date: '2026-04-08', amount: 200, category: 'Health', type: 'expense', description: 'Gym membership' },
  { id: '9', date: '2026-04-09', amount: 450, category: 'Investment', type: 'income', description: 'Dividend payout' },
  { id: '10', date: '2026-04-10', amount: 95, category: 'Food & Dining', type: 'expense', description: 'Restaurant dinner' },
  { id: '11', date: '2026-03-15', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: '12', date: '2026-03-18', amount: 180, category: 'Shopping', type: 'expense', description: 'Clothing' },
  { id: '13', date: '2026-03-20', amount: 350, category: 'Bills & Utilities', type: 'expense', description: 'Internet & Phone' },
  { id: '14', date: '2026-03-22', amount: 75, category: 'Entertainment', type: 'expense', description: 'Concert tickets' },
  { id: '15', date: '2026-03-25', amount: 600, category: 'Freelance', type: 'income', description: 'Consulting work' },
]

export const balanceData: BalanceData[] = [
  { month: 'Oct', balance: 12500 },
  { month: 'Nov', balance: 14200 },
  { month: 'Dec', balance: 13800 },
  { month: 'Jan', balance: 15600 },
  { month: 'Feb', balance: 17200 },
  { month: 'Mar', balance: 18500 },
  { month: 'Apr', balance: 24580 },
]

export const categoryData: CategoryData[] = [
  { category: 'Food & Dining', amount: 450, fill: 'var(--color-chart-1)' },
  { category: 'Shopping', amount: 680, fill: 'var(--color-chart-2)' },
  { category: 'Transportation', amount: 320, fill: 'var(--color-chart-3)' },
  { category: 'Bills & Utilities', amount: 500, fill: 'var(--color-chart-4)' },
  { category: 'Entertainment', amount: 280, fill: 'var(--color-chart-5)' },
  { category: 'Health', amount: 200, fill: 'var(--color-primary)' },
]

export const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'] as const
export const expenseCategories = ['Food & Dining', 'Shopping', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Health', 'Other'] as const
