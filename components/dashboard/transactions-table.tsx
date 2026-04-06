'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty } from '@/components/ui/empty'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDashboard } from '@/lib/dashboard-context'
import { TransactionDialog } from './transaction-dialog'
import type { Transaction, TransactionType } from '@/lib/types'

type SortField = 'date' | 'amount'
type SortDirection = 'asc' | 'desc'

export function TransactionsTable() {
  const { role, filteredTransactions, deleteTransaction, deleteMultipleTransactions } = useDashboard()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  const displayTransactions = useMemo(() => {
    let result = [...filteredTransactions]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        t =>
          t.category.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
    })

    return result
  }, [filteredTransactions, search, typeFilter, sortField, sortDirection])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingTransaction(null)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      setTransactionToDelete(null)
    }
    setDeleteConfirmOpen(false)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(displayTransactions.map(t => t.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteConfirmOpen(true)
  }

  const handleConfirmBulkDelete = () => {
    deleteMultipleTransactions(Array.from(selectedIds))
    setSelectedIds(new Set())
    setBulkDeleteConfirmOpen(false)
  }

  const isAdmin = role === 'admin'
  const allSelected = displayTransactions.length > 0 && selectedIds.size === displayTransactions.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < displayTransactions.length

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                {displayTransactions.length} transaction{displayTransactions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                {selectedIds.size > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleBulkDeleteClick}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedIds.size})
                  </Button>
                )}
                <Button onClick={handleAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by category or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TransactionType | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {displayTransactions.length === 0 ? (
            <Empty
              title="No transactions found"
              description={search || typeFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first transaction to get started'}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin && (
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all transactions"
                          className={someSelected ? 'data-[state=checked]:bg-primary' : ''}
                          {...(someSelected ? { 'data-state': 'indeterminate' } : {})}
                        />
                      </TableHead>
                    )}
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort('date')}
                        className="-ml-3 gap-1 font-medium"
                      >
                        Date
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort('amount')}
                        className="-mr-3 gap-1 font-medium"
                      >
                        Amount
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className={selectedIds.has(transaction.id) ? 'bg-muted/50' : ''}>
                      {isAdmin && (
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(transaction.id)}
                            onCheckedChange={(checked) => handleSelectOne(transaction.id, checked as boolean)}
                            aria-label={`Select transaction ${transaction.description}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === 'income' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        <span className={transaction.type === 'income' ? 'text-primary' : 'text-destructive'}>
                          {transaction.type === 'income' ? '+' : '-'}₹
                          {transaction.amount.toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(transaction)}
                              aria-label="Edit transaction"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(transaction)}
                              aria-label="Delete transaction"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        transaction={editingTransaction}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Transactions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected transaction{selectedIds.size !== 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
