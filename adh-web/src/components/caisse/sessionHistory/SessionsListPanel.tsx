import { useMemo } from 'react'
import type { ApiResponse } from '@/services/api/apiClient'
import { apiClient } from '@/services/api/apiClient'
import { useDataSourceStore } from '@/stores/dataSourceStore'
import { DataGrid } from '@/components/ui'
import { cn } from '@/lib/utils'

interface SessionsListPanelProps {
  sessions: SessionListItem[]
  isLoading?: boolean
  selectedSessionId?: string | null
  onSessionSelect?: (sessionId: string) => void
  onSort?: (column: string) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  className?: string
}

interface SessionListItem {
  sessionId: string
  openedDate: string
  openedTime: string
  closedDate?: string
  closedTime?: string
  operatorId: string
  status: 'OPEN' | 'CLOSED' | 'SUSPENDED'
}

const sessionStatusColors = {
  OPEN: 'text-green-600 bg-green-50 border-green-200',
  CLOSED: 'text-gray-600 bg-gray-50 border-gray-200',
  SUSPENDED: 'text-yellow-600 bg-yellow-50 border-yellow-200'
} as const

export const SessionsListPanel = ({
  sessions,
  isLoading = false,
  selectedSessionId,
  onSessionSelect,
  onSort,
  sortBy,
  sortOrder = 'asc',
  className
}: SessionsListPanelProps) => {
  const { isRealApi } = useDataSourceStore.getState()

  const columns = useMemo(() => [
    {
      key: 'sessionId',
      label: 'Session ID',
      sortable: true,
      width: '15%'
    },
    {
      key: 'openedDate',
      label: 'Opened Date',
      sortable: true,
      width: '15%'
    },
    {
      key: 'openedTime',
      label: 'Opened Time',
      sortable: true,
      width: '12%'
    },
    {
      key: 'closedDate',
      label: 'Closed Date',
      sortable: true,
      width: '15%'
    },
    {
      key: 'closedTime',
      label: 'Closed Time',
      sortable: true,
      width: '12%'
    },
    {
      key: 'operatorId',
      label: 'Operator ID',
      sortable: true,
      width: '16%'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '15%'
    }
  ], [])

  const renderCell = (item: SessionListItem, columnKey: string) => {
    switch (columnKey) {
      case 'sessionId':
        return (
          <button
            onClick={() => onSessionSelect?.(item.sessionId)}
            className={cn(
              'text-left font-medium hover:text-blue-600 transition-colors',
              selectedSessionId === item.sessionId && 'text-blue-600'
            )}
          >
            {item.sessionId}
          </button>
        )
      
      case 'openedDate':
        return <span className="text-gray-900">{item.openedDate}</span>
      
      case 'openedTime':
        return <span className="text-gray-700 font-mono text-sm">{item.openedTime}</span>
      
      case 'closedDate':
        return (
          <span className="text-gray-900">
            {item.closedDate || '-'}
          </span>
        )
      
      case 'closedTime':
        return (
          <span className="text-gray-700 font-mono text-sm">
            {item.closedTime || '-'}
          </span>
        )
      
      case 'operatorId':
        return <span className="text-gray-900 font-medium">{item.operatorId}</span>
      
      case 'status':
        return (
          <span
            className={cn(
              'inline-flex px-2 py-1 rounded-md text-xs font-medium border',
              sessionStatusColors[item.status]
            )}
          >
            {item.status}
          </span>
        )
      
      default:
        return null
    }
  }

  const handleSort = (columnKey: string) => {
    onSort?.(columnKey)
  }

  const handleRowClick = (item: SessionListItem) => {
    onSessionSelect?.(item.sessionId)
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading sessions...</span>
        </div>
      </div>
    )
  }

  if (!sessions.length) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-64', className)}>
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium mb-1">No sessions found</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters or date range</p>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Sessions ({sessions.length})
        </h3>
      </div>
      
      <DataGrid
        columns={columns}
        data={sessions}
        renderCell={renderCell}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onRowClick={handleRowClick}
        selectedRowId={selectedSessionId}
        className="border-0"
        rowClassName={(item: SessionListItem) =>
          cn(
            'hover:bg-gray-50 cursor-pointer transition-colors',
            selectedSessionId === item.sessionId && 'bg-blue-50'
          )
        }
      />
    </div>
  )
}