'use client'

import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/lib/dashboard-context'

export function SummaryCards() {
  const { filteredTransactions } = useDashboard()

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  const cards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: Wallet,
      trend: '+12.5%',
      trendUp: true,
      description: 'from last month',
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: ArrowUpRight,
      trend: '+8.2%',
      trendUp: true,
      description: 'from last month',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: ArrowDownRight,
      trend: '-3.1%',
      trendUp: false,
      description: 'from last month',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              ₹{card.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <span
                className={`flex items-center gap-0.5 font-medium ${
                  card.trendUp ? 'text-primary' : 'text-destructive'
                }`}
              >
                <TrendingUp className={`h-3 w-3 ${!card.trendUp && 'rotate-180'}`} />
                {card.trend}
              </span>
              <span className="text-muted-foreground">{card.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
