import React, { useState } from 'react'
import { Edit2, List, Trash2, ChevronDown, ChevronRight, Globe, Star } from 'lucide-react'
import type { PatientCase } from '../../../types/case'
import { cn } from '../../../lib/cn'
import { StepEditModal } from '../../../components/step-edit-modal'
import { CaseEditModal } from '../../../components/case-edit-modal'
import { Modal } from '../../../components/modal'
import { Button } from '../../../components/button'
import { Pagination } from './pagination'
import JawStlFiles from './jaw-files'

interface CaseTableProps {
  cases: PatientCase[]
  onDelete?: (id: string) => void
  onUpdate?: (caseItem: PatientCase) => void
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
  loading?: boolean
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric', month: 'short', day: 'numeric',
})

const BADGE: Record<string, string> = {
  delivered: 'bg-[#539987] text-white',
  finishing:  'bg-[#f4e9d6] text-text',
  stacking:   'bg-[#e6f1fb] text-text',
  printing:   'bg-[#E7CEE3] text-text',
  stl:        'bg-primary/20 text-text',
  none:       'bg-secondary-tint text-secondary-tint-text',
}

export function CaseTable({
  cases,
  onDelete,
  onUpdate,
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  loading = false,
}: CaseTableProps) {
  const [expandedRows, setExpandedRows] = useState<string | null>(null)
  const [showStepModal, setShowStepModal] = useState(false)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null)
  const [caseToDelete, setCaseToDelete] = useState<PatientCase | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
    setCaseToDelete(caseItem)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (!caseToDelete) return
    onDelete?.(caseToDelete.id)
    setShowDeleteConfirm(false)
    setCaseToDelete(null)
    setExpandedRows((current) => (current === caseToDelete.id ? null : current))
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

  function getStage(caseItem: PatientCase): { key: string; label: string } {
    if (caseItem.steps.delivered.completed)  return { key: 'delivered', label: 'Delivered'  }
    if (caseItem.steps.finishing.completed)  return { key: 'finishing', label: 'Finishing'  }
    if (caseItem.steps.stacking.completed)   return { key: 'stacking',  label: 'Stacking'   }
    if (caseItem.steps.printing.completed)   return { key: 'printing',  label: 'Printing'   }
    if (caseItem.steps.stl.completed)        return { key: 'stl',       label: 'STL Design' }
    return { key: 'none', label: 'New' }
  }

  return (
    <>
      <div className="bg-white rounded  border-secondary-tint overflow-hidden shadow-xs shadow-secondary/60">
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
                Stage
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
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-t border-secondary-tint">
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-3">
                      <div className="h-4 rounded bg-secondary/20 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-sm text-text-muted">
                  No cases found. Try changing filters or create a new case.
                </td>
              </tr>
            ) : (
              cases.map((caseItem) => {
                const isExpanded = expandedRows === caseItem.id
                const stage = getStage(caseItem)

                return (
                  <React.Fragment key={caseItem.id}>
                    <tr className="border-t border-secondary-tint hover:bg-black/2 transition-colors">
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
                        <span className="flex items-center w-fit gap-1 text-[11px] font-semibold uppercase text-primary rounded">
                          <Globe className='w-3 h-3' /> <span>{caseItem.websiteName}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <p className={`text-[10px] rounded w-fit px-2 py-0.5 ${BADGE[stage.key]}`}>
                          {stage.label}
                        </p>
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
                        <td colSpan={6} className="px-3 py-2">
                          <div className="">
                            <JawStlFiles caseItem={caseItem} onUpdate={onUpdate} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </tbody>
          {cases.length > 0 && !loading && (
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
          )}
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

      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete case"
      >
        <div className="space-y-4 p-2">
          <p className="text-sm text-text">Are you sure you want to delete this case? This action cannot be undone.</p>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
            >
              Delete case
            </Button>
          </div>
        </div>
      </Modal>
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