import { DashboardProvider } from '@/lib/dashboard-context'
import { DashboardHeader } from '@/components/dashboard/header'
import { DateFilter } from '@/components/dashboard/date-filter'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { BalanceChart, ExpenseBreakdownChart } from '@/components/dashboard/charts'
import { TransactionsTable } from '@/components/dashboard/transactions-table'
import { Insights } from '@/components/dashboard/insights'

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
              <p className="text-muted-foreground">
                Track your income, expenses, and financial health
              </p>
            </div>
            <DateFilter />
          </div>

          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards />

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <BalanceChart />
              <ExpenseBreakdownChart />
            </div>

            {/* Insights Section */}
            <Insights />

            {/* Transactions Table */}
            <TransactionsTable />
          </div>
        </main>
      </div>
    </DashboardProvider>
  )
}
