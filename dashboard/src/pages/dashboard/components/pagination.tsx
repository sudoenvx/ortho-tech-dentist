import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import { cn } from '../../../lib/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * perPage + 1
  const end   = Math.min(currentPage * perPage, totalItems)

  const pages = buildPageSequence(currentPage, totalPages)

  return (
    <div className="flex items-center justify-between mt-2 ">
      <span className="text-[12px] text-text-muted">
        Showing {start}–{end} of {totalItems} cases
      </span>

      <div className="flex items-center gap-1">
        <PgBtn
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          <ChevronLeft size={13} />
        </PgBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className="text-[12px] text-text-muted px-1">…</span>
          ) : (
            <PgBtn
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </PgBtn>
          )
        )}

        <PgBtn
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          <ChevronRight size={13} />
        </PgBtn>
      </div>
    </div>
  )
}

function PgBtn({
  children, onClick, disabled, active, title,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'min-w-[28px] h-[28px] px-1.5 rounded text-[12px] font-medium',
        'transition-colors flex items-center justify-center',
        active
          ? 'bg-primary border-primary text-primary-text'
          : 'bg-secondary/15  text-text-muted hover:bg-secondary/20 hover:text-text hover:border-border-strong',
        disabled && 'opacity-35 cursor-not-allowed pointer-events-none',
      )}
    >
      {children}
    </button>
  )
}

function buildPageSequence(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}