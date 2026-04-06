'use client'

import { useMemo } from 'react'
import { Area, AreaChart, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { useDashboard } from '@/lib/dashboard-context'
import type { Category } from '@/lib/types'

const areaChartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--color-primary)',
  },
} satisfies ChartConfig

const pieChartConfig = {
  'Food & Dining': {
    label: 'Food & Dining',
    color: 'var(--color-chart-1)',
  },
  'Shopping': {
    label: 'Shopping',
    color: 'var(--color-chart-2)',
  },
  'Transportation': {
    label: 'Transportation',
    color: 'var(--color-chart-3)',
  },
  'Bills & Utilities': {
    label: 'Bills & Utilities',
    color: 'var(--color-chart-4)',
  },
  'Entertainment': {
    label: 'Entertainment',
    color: 'var(--color-chart-5)',
  },
  'Health': {
    label: 'Health',
    color: 'var(--color-primary)',
  },
} satisfies ChartConfig

const categoryColors: Record<string, string> = {
  'Food & Dining': 'var(--color-chart-1)',
  'Shopping': 'var(--color-chart-2)',
  'Transportation': 'var(--color-chart-3)',
  'Bills & Utilities': 'var(--color-chart-4)',
  'Entertainment': 'var(--color-chart-5)',
  'Health': 'var(--color-primary)',
}

export function BalanceChart() {
  const { filteredTransactions, dateFilter } = useDashboard()

  // Calculate cumulative balance for each transaction date
  const balanceData = useMemo(() => {
    if (filteredTransactions.length === 0) return []

    // Sort transactions by date ascending
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Build cumulative balance data - one point per unique date
    const dateBalances: { date: string; timestamp: number; balance: number }[] = []
    let runningBalance = 0

    sortedTransactions.forEach(t => {
      const amount = t.type === 'income' ? t.amount : -t.amount
      runningBalance += amount
      
      const transactionDate = new Date(t.date)
      const timestamp = transactionDate.getTime()
      const dateLabel = transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      // Check if we already have an entry for this date
      const existingIndex = dateBalances.findIndex(d => d.date === dateLabel)
      if (existingIndex >= 0) {
        // Update the balance for this date (last transaction wins)
        dateBalances[existingIndex].balance = runningBalance
      } else {
        // Add new date entry
        dateBalances.push({
          date: dateLabel,
          timestamp,
          balance: runningBalance,
        })
      }
    })

    // Sort by timestamp to ensure correct order and return formatted data
    return dateBalances
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ date, balance }) => ({
        month: date,
        balance,
      }))
  }, [filteredTransactions])

  const getDescription = () => {
    switch (dateFilter) {
      case '7days':
        return 'Your account balance trend for the last 7 days'
      case '30days':
        return 'Your account balance trend for the last 30 days'
      case 'custom':
        return 'Your account balance trend for selected period'
      default:
        return 'Your account balance trend over all time'
    }
  }

  if (balanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance Over Time</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available for selected period
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Over Time</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={areaChartConfig} className="h-[300px] w-full">
          <AreaChart
            data={balanceData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Balance']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ExpenseBreakdownChart() {
  const { filteredTransactions, dateFilter } = useDashboard()

  const categoryData = useMemo(() => {
    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<Category, number>)

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      fill: categoryColors[category] || 'var(--color-muted)',
    }))
  }, [filteredTransactions])

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0)

  const getDescription = () => {
    switch (dateFilter) {
      case '7days':
        return 'Spending distribution for the last 7 days'
      case '30days':
        return 'Spending distribution for the last 30 days'
      case 'custom':
        return 'Spending distribution for selected period'
      default:
        return 'Spending distribution by category'
    }
  }

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available for selected period
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString('en-IN')} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
              }
            />
            <Pie
              data={categoryData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((item) => (
            <div key={item.category} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground">{item.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
