import React, { useState } from 'react'
import { Edit2, List, Trash2, ChevronDown, ChevronRight, Globe, Star } from 'lucide-react'
import type { PatientCase } from '../../../types/case'
import { cn } from '../../../lib/cn'
import { StepEditModal } from '../../../components/step-edit-modal'
import { CaseEditModal } from '../../../components/case-edit-modal'
import { Pagination } from './pagination'
import StlFiles from './jaw-files'

interface CaseTableProps {
  cases: PatientCase[]
  onDelete?: (id: string) => void
  onUpdate?: (caseItem: PatientCase) => void
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric', month: 'short', day: 'numeric',
})

export function CaseTable({
  cases,
  onDelete,
  onUpdate,
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange
}: CaseTableProps) {
  const [expandedRows, setExpandedRows] = useState<string | null>(null)
  const [showStepModal, setShowStepModal] = useState(false)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null)

  const toggleRowExpansion = (caseId: string) => {
    setExpandedRows(expandedRows === caseId ? null : caseId)
  }

  const toggleImportant = (caseItem: PatientCase) => {
    onUpdate?.({ ...caseItem, isImportant: !caseItem.isImportant })
  }

  const handleEditSteps = (caseItem: PatientCase) => {
    setSelectedCase(caseItem)
    setShowStepModal(true)
  }

  const handleEditRecord = (caseItem: PatientCase) => {
    setSelectedCase(caseItem)
    setShowRecordModal(true)
  }

  const handleDelete = (caseItem: PatientCase) => {
    onDelete?.(caseItem.id)
  }

  const handleSaveSteps = (updatedCase: PatientCase) => {
    onUpdate?.(updatedCase)
    setShowStepModal(false)
    setSelectedCase(null)
  }

  const handleSaveRecord = (updatedCase: PatientCase) => {
    onUpdate?.(updatedCase)
    setShowRecordModal(false)
    setSelectedCase(null)
  }

  return (
    <>
      <div className="bg-white rounded-md border border-secondary-tint overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/80">
              <th className="text-left px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text">
                Patient
              </th>
              <th className="text-left px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text">
                Doctor
              </th>
              <th className="text-left px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text">
                Website
              </th>
              <th className="text-left px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text">
                Updated At
              </th>
              <th className="text-right px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => {
              const isExpanded = expandedRows === caseItem.id

              return (
                <React.Fragment key={caseItem.id}>
                  <tr
                    className="border-t border-secondary-tint hover:bg-black/2 transition-colors"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRowExpansion(caseItem.id)}
                          className="flex items-center"
                        >
                          {isExpanded ? (
                            <ChevronDown size={14} className="text-text-muted" />
                          ) : (
                            <ChevronRight size={14} className="text-text-muted" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-text truncate leading-tight">
                            {caseItem.patientName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-[12px] text-text leading-tight">{caseItem.doctorName}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center w-fit gap-1 text-[11px] rounded-full px-1.5 py-1 bg-secondary-tint text-secondary-tint-text">
                        <Globe className='w-3.5 h-3.5' /> <span>{caseItem.websiteName}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-[11px] text-text-muted">
                        {dateFormatter.format(new Date(caseItem.updatedAt))}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 justify-end">
                        <ActionBtn
                          title="Toggle important"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleImportant(caseItem)
                          }}
                          className={cn(
                            "text-text",
                            caseItem.isImportant ? "bg-yellow-500/30 hover:bg-yellow-500/40" : "bg-secondary/30 hover:bg-secondary/40"
                          )}
                        >
                          <Star size={13} fill={caseItem.isImportant ? "currentColor" : "none"} />
                        </ActionBtn>
                        <ActionBtn
                          title="Edit steps"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditSteps(caseItem)
                          }}
                          className="bg-primary/30 hover:bg-primary/40 text-text"
                        >
                          <List size={13} />
                        </ActionBtn>
                        <ActionBtn
                          title="Edit record"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditRecord(caseItem)
                          }}
                          className='bg-secondary/30 hover:bg-secondary/40 text-text'
                        >
                          <Edit2 size={13} />
                        </ActionBtn>
                        <ActionBtn
                          title="Delete case"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(caseItem)
                          }}
                          className="bg-danger/30 hover:bg-danger/40 text-text"
                        >
                          <Trash2 size={13} />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-[#e8e8e7]">
                      <td colSpan={5} className="px-3 py-2">
                        <div className="">
                          <StlFiles caseItem={caseItem} onUpdate={onUpdate} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="px-3 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  perPage={perPage}
                  onPageChange={onPageChange}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {selectedCase && (
        <>
          <StepEditModal
            open={showStepModal}
            onClose={() => {
              setShowStepModal(false)
              setSelectedCase(null)
            }}
            caseItem={selectedCase}
            onSave={handleSaveSteps}
          />
          <CaseEditModal
            open={showRecordModal}
            onClose={() => {
              setShowRecordModal(false)
              setSelectedCase(null)
            }}
            caseItem={selectedCase}
            onSave={handleSaveRecord}
          />
        </>
      )}
    </>
  )
}

function ActionBtn({ children, title, onClick, className = '' }: {
  children: React.ReactNode
  title: string
  onClick: (e: React.MouseEvent) => void
  className?: string
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        'w-6.5 h-6.5 flex items-center justify-center rounded transition-colors',
        className,
      )}
    >
      {children}
    </button>
  )
}