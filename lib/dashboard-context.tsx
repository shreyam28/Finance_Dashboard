'use client'

import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react'
import type { Role, Transaction, DateFilterOption, DateRange } from './types'
import { transactions as initialTransactions } from './data'

interface DashboardContextType {
  role: Role
  setRole: (role: Role) => void
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  deleteMultipleTransactions: (ids: string[]) => void
  dateFilter: DateFilterOption
  setDateFilter: (filter: DateFilterOption) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('admin')
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all')
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTransactions = useMemo(() => {
    // Return all transactions before hydration to avoid mismatch
    if (!mounted || dateFilter === 'all') {
      return transactions
    }

    const now = new Date()
    now.setHours(23, 59, 59, 999)
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      
      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 7)
        sevenDaysAgo.setHours(0, 0, 0, 0)
        return transactionDate >= sevenDaysAgo && transactionDate <= now
      }
      
      if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(now.getDate() - 30)
        thirtyDaysAgo.setHours(0, 0, 0, 0)
        return transactionDate >= thirtyDaysAgo && transactionDate <= now
      }
      
      if (dateFilter === 'custom' && dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start)
        start.setHours(0, 0, 0, 0)
        const end = new Date(dateRange.end)
        end.setHours(23, 59, 59, 999)
        return transactionDate >= start && transactionDate <= end
      }
      
      return true
    })
  }, [transactions, dateFilter, dateRange, mounted])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const editTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...transaction, id } : t))
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const deleteMultipleTransactions = (ids: string[]) => {
    setTransactions(prev => prev.filter(t => !ids.includes(t.id)))
  }

  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        transactions,
        filteredTransactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        deleteMultipleTransactions,
        dateFilter,
        setDateFilter,
        dateRange,
        setDateRange,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
