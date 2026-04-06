'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDashboard } from '@/lib/dashboard-context'
import type { DateFilterOption } from '@/lib/types'

export function DateFilter() {
  const { dateFilter, setDateFilter, dateRange, setDateRange } = useDashboard()
  const [customOpen, setCustomOpen] = useState(false)
  const [tempStart, setTempStart] = useState('')
  const [tempEnd, setTempEnd] = useState('')

  const handleFilterChange = (value: DateFilterOption) => {
    setDateFilter(value)
    if (value === 'custom') {
      setCustomOpen(true)
    }
  }

  const handleApplyCustomRange = () => {
    if (tempStart && tempEnd) {
      setDateRange({
        start: new Date(tempStart),
        end: new Date(tempEnd),
      })
      setCustomOpen(false)
    }
  }

  const getDisplayValue = () => {
    if (dateFilter === 'custom' && dateRange.start && dateRange.end) {
      const formatDate = (date: Date) =>
        date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
    }
    return undefined
  }

  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <Select value={dateFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period">
            {getDisplayValue()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 Days</SelectItem>
          <SelectItem value="30days">Last 30 Days</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {dateFilter === 'custom' && (
        <Popover open={customOpen} onOpenChange={setCustomOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {dateRange.start && dateRange.end ? 'Edit Range' : 'Set Range'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Custom Date Range</h4>
                <p className="text-sm text-muted-foreground">
                  Select start and end dates
                </p>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleApplyCustomRange}
                disabled={!tempStart || !tempEnd}
              >
                Apply Range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
