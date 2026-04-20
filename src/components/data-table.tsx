import React from 'react'
import { cn } from '../lib/cn'

export interface DataTableColumn<T> {
  header: string
  accessor?: keyof T
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  cellClassName?: string
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>
  data: T[]
  loading?: boolean
  emptyMessage?: string
  rowKey?: (item: T) => string
  footer?: React.ReactNode
  actions?: (item: T) => React.ReactNode
  children?: (item: T) => React.ReactNode
  actionsHeader?: string
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No items found.',
  rowKey,
  footer,
  actions,
  children,
  actionsHeader = 'Actions',
}: DataTableProps<T>) {
  const renderActions = actions ?? children

  return (
    <div className="bg-white rounded border-secondary-tint overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-secondary/80">
            {columns.map((column) => (
              <th
                key={column.header}
                className={cn(
                  'text-left px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
            {renderActions && (
              <th className="text-right px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text">
                {actionsHeader}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="border-t border-secondary-tint">
                {Array.from({ length: columns.length + (renderActions ? 1 : 0) }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-3">
                    <div className="h-4 rounded bg-secondary/20 animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-3 py-4 text-center text-sm text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={rowKey ? rowKey(item) : String((item as any).id ?? JSON.stringify(item))} className="border-t border-secondary-tint hover:bg-black/2 transition-colors">
                {columns.map((column) => (
                  <td key={column.header} className={cn('px-3 py-2 align-center text-[13px] text-text leading-tight', column.cellClassName)}>
                    {column.render ? column.render(item) : String(item[column.accessor ?? '' as T] ?? '')}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-3 py-2 text-right align-top">
                    <div className="flex items-center gap-1 justify-end">
                      {renderActions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
        {data.length > 0 && !loading && footer ? (
          <tfoot>
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-3 py-3">
                {footer}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  )
}
