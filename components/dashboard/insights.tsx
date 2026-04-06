'use client'

import { AlertCircle, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/lib/dashboard-context'
import type { Category } from '@/lib/types'

export function Insights() {
  const { filteredTransactions } = useDashboard()

  // Calculate insights
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<Category, number>)

  const highestSpendingCategory = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0]

  // Current month vs previous month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthExpenses = filteredTransactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const previousMonthExpenses = filteredTransactions
    .filter(t => {
      const date = new Date(t.date)
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return t.type === 'expense' && date.getMonth() === prevMonth && date.getFullYear() === prevYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyChange = previousMonthExpenses
    ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    : 0

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  const insights = [
    {
      icon: AlertCircle,
      title: 'Highest Spending',
      description: highestSpendingCategory
        ? `${highestSpendingCategory[0]} accounts for ₹${highestSpendingCategory[1].toLocaleString('en-IN')} of your expenses`
        : 'No expense data available',
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
    {
      icon: monthlyChange >= 0 ? TrendingUp : TrendingDown,
      title: 'Monthly Comparison',
      description:
        monthlyChange >= 0
          ? `Your spending is up ${Math.abs(monthlyChange).toFixed(1)}% compared to last month`
          : `Your spending is down ${Math.abs(monthlyChange).toFixed(1)}% compared to last month`,
      color: monthlyChange >= 0 ? 'text-destructive' : 'text-primary',
      bgColor: monthlyChange >= 0 ? 'bg-destructive/10' : 'bg-primary/10',
    },
    {
      icon: Lightbulb,
      title: 'Savings Rate',
      description:
        savingsRate > 0
          ? `You are saving ${savingsRate.toFixed(1)}% of your income. ${savingsRate >= 20 ? 'Great job!' : 'Try to aim for 20%+'}`
          : 'Track more transactions to see your savings rate',
      color: savingsRate >= 20 ? 'text-primary' : 'text-warning',
      bgColor: savingsRate >= 20 ? 'bg-primary/10' : 'bg-warning/10',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Insights</CardTitle>
        <CardDescription>Key observations about your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${insight.bgColor}`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <div>
                <h4 className="font-medium">{insight.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
