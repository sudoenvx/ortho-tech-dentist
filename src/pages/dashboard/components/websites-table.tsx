import React, { useMemo } from 'react'
import { Edit2, Trash2, Eye, EyeOff, Globe } from 'lucide-react'
import { Website } from '../../../types/website'
import type { PatientCase } from '../../../types/case'
import { cn } from '../../../lib/cn'
import { DataTable, type DataTableColumn } from '../../../components/data-table'

interface WebsitesTableProps {
  websites: Website[]
  cases: PatientCase[]
  onEdit: (website: Website) => void
  onDelete: (website: Website) => void
  isLoading?: boolean
}

export function WebsitesTable({
  websites,
  cases,
  onEdit,
  onDelete,
  isLoading = false,
}: WebsitesTableProps) {
  const websitePatientCounts = useMemo(() => {
    const counts = new Map<string, number>()
    cases.forEach((caseItem) => {
      counts.set(caseItem.websiteId, (counts.get(caseItem.websiteId) || 0) + 1)
    })
    return counts
  }, [cases])

  const columns = useMemo<Array<DataTableColumn<Website>>>(() => [
    {
      header: 'Website',
      render: (website) => (
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text truncate leading-tight">
            {website.name}
          </p>
        </div>
      ),
    },
    {
      header: 'Link',
      render: (website) => (
        website.link ? (
          <a
            href={website.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase text-primary hover:underline"
            title={website.link}
          >
            <Globe className="w-3 h-3" />
            <span>{website.link.replace(/^https?:\/\//, '').split('/')[0]}</span>
          </a>
        ) : (
          <span className="text-[13px] text-text-muted">---</span>
        )
      ),
    },
    {
      header: 'Status',
      render: (website) => (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] uppercase',
            website.isActive
              ? 'bg-success/30 text-text'
              : 'bg-danger/30 text-text'
          )}
        >
          {website.isActive ? 'Active' : 'Not active'}
        </span>
      ),
    },
    {
      header: 'Patients',
      render: (website) => {
        const patientCount = websitePatientCounts.get(website.id) || 0

        return (
          <div className='flex items-center gap-1 font-medium'>
            <p className="text-[12px] text-text-muted leading-tight">{patientCount}</p>
            <p className="text-[12px] text-text-muted">
              {patientCount === 1 ? 'patient' : 'patients'}
            </p>
          </div>
        )
      },
    },
  ], [websitePatientCounts])

  return (
    <DataTable
      columns={columns}
      data={websites}
      loading={isLoading}
      emptyMessage="No websites found. Create a new website to get started."
      rowKey={(website) => website.id}
      actions={(website) => {
        const patientCount = websitePatientCounts.get(website.id) || 0

        return (
          <>
            <ActionBtn
              title="Edit website"
              onClick={() => onEdit(website)}
              className="bg-secondary/30 hover:bg-secondary/40 text-text"
            >
              <Edit2 size={13} />
            </ActionBtn>
            <ActionBtn
              title={
                patientCount > 0
                  ? 'Cannot delete a website with linked patients'
                  : 'Delete website'
              }
              onClick={() => onDelete(website)}
              className={cn(
                patientCount > 0
                  ? 'bg-secondary/15 text-text-muted cursor-not-allowed'
                  : 'bg-danger/30 hover:bg-danger/40 text-text'
              )}
              disabled={patientCount > 0}
            >
              <Trash2 size={13} />
            </ActionBtn>
          </>
        )
      }}
    />
  )
}

function ActionBtn({
  children,
  title,
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode
  title: string
  onClick: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-6.5 h-6.5 flex items-center justify-center rounded transition-colors disabled:opacity-100',
        className,
      )}
    >
      {children}
    </button>
  )
}
