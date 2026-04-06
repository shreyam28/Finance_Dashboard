export type Role = 'viewer' | 'admin'

export type DateFilterOption = '7days' | '30days' | 'all' | 'custom'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type TransactionType = 'income' | 'expense'

export type Category = 
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Health'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: Category
  type: TransactionType
  description: string
}

export interface BalanceData {
  month: string
  balance: number
}

export interface CategoryData {
  category: Category
  amount: number
  fill: string
}
