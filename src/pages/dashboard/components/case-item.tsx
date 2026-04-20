import React, { useMemo, useState } from 'react'
import { Edit2, List, Trash2 } from 'lucide-react'
import type { PatientCase } from '../../../types/case'
import { cn } from '../../../lib/cn'
import { StepEditModal } from '../../../components/step-edit-modal'
import { CaseEditModal } from '../../../components/case-edit-modal'

interface CaseItemProps {
  caseItem: PatientCase
  onDelete?: (id: string) => void
  onUpdate?: (caseItem: PatientCase) => void
}

function getStage(caseItem: PatientCase): { key: string; label: string } {
  if (caseItem.steps.delivered.completed)  return { key: 'delivered', label: 'Delivered'  }
  if (caseItem.steps.finishing.completed)  return { key: 'finishing', label: 'Finishing'  }
  if (caseItem.steps.stacking.completed)   return { key: 'stacking',  label: 'Stacking'   }
  if (caseItem.steps.printing.completed)   return { key: 'printing',  label: 'Printing'   }
  if (caseItem.steps.stl.completed)        return { key: 'stl',       label: 'STL Design' }
  return { key: 'none', label: 'New' }
}

// const STRIPE: Record<string, string> = {
//   delivered: 'border-[#4a7c6f]',
//   finishing:  'border-[#BA7517]',
//   stacking:   'border-[#185FA5]',
//   printing:   'border-[#534AB7]',
//   stl:        'border-[#42444c]',
//   none:       'border-[#b2505d]',
// }

const BADGE: Record<string, string> = {
  delivered: 'bg-[#eef4f0] text-[#2a5a4a]',
  finishing:  'bg-[#f4e9d6] text-[#7a4f10]',
  stacking:   'bg-[#e6f1fb] text-[#0a3d6e]',
  printing:   'bg-[#EEEDFE] text-[#3C3489]',
  stl:        'bg-[#dedede] text-[#1a1a22]',
  none:       'bg-[#e7d5d7] text-[#7a2030]',
}

const DOT: Record<string, string> = {
  delivered: 'bg-[#4a7c6f]',
  finishing:  'bg-[#BA7517]',
  stacking:   'bg-[#185FA5]',
  printing:   'bg-[#534AB7]',
  stl:        'bg-[#42444c]',
  none:       'bg-[#b2505d]',
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric', month: 'short', day: 'numeric',
})

export function CaseItem({ caseItem, onDelete, onUpdate }: CaseItemProps) {
  const [showStepModal,   setShowStepModal]   = useState(false)
  const [showRecordModal, setShowRecordModal] = useState(false)

  const stage = useMemo(() => getStage(caseItem), [caseItem.steps])

  return (
    <>
      {/* Row */}
      <div
        className={cn(
          'grid items-center gap-2  border-secondary-tint rounded',
          'pl-2.75 pr-3 py-1.75',
          '',
        //   STRIPE[stage.key],
          'bg-white transition-colors',
        )}
        style={{ gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr 80px' }}
      >
        {/* Patient */}
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text truncate leading-tight">
            {caseItem.patientName}
          </p>
          <p className="text-[11px] text-text-muted font-mono mt-0.5">
            {caseItem.id.slice(0, 8)}
          </p>
        </div>

        {/* Stage badge */}
        <div>
          <span className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full',
            BADGE[stage.key],
          )}>
            <span className={cn('w-1.25 h-1.25 rounded-full shrink-0', DOT[stage.key])} />
            {stage.label}
          </span>
        </div>

        {/* Doctor + date */}
        <div>
          <p className="text-[12px] text-text leading-tight">{caseItem.doctorName}</p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {dateFormatter.format(new Date(caseItem.updatedAt))}
          </p>
        </div>

        {/* Website */}
        <div>
          <span className="inline-block text-[11px] rounded px-2 py-0.5 bg-secondary-tint text-secondary-tint-text">
            {caseItem.websiteName}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 justify-end">
          <ActionBtn title="Edit steps"  onClick={() => setShowStepModal(true)}   className="bg-primary hover:bg-primary/80 text-primary-text">
            <List size={13} />
          </ActionBtn>
          <ActionBtn title="Edit record" onClick={() => setShowRecordModal(true)} className='bg-secondary hover:bg-secondary/80 text-secondary-text'>
            <Edit2 size={13} />
          </ActionBtn>
          <ActionBtn title="Delete case" onClick={() => onDelete?.(caseItem.id)}  className="bg-danger text-danger-text hover:bg-danger/80">
            <Trash2 size={13} />
          </ActionBtn>
        </div>
      </div>

      <StepEditModal
        open={showStepModal}
        onClose={() => setShowStepModal(false)}
        caseItem={caseItem}
        onSave={(updated) => { onUpdate?.(updated); setShowStepModal(false) }}
      />
      <CaseEditModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        caseItem={caseItem}
        onSave={(updated) => { onUpdate?.(updated); setShowRecordModal(false) }}
      />
    </>
  )
}

function ActionBtn({ children, title, onClick, className = '' }: {
  children: React.ReactNode
  title: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        'w-6.5 h-6.5 flex items-center justify-center',
        'rounded',
        ' transition-colors',
        className,
      )}
    >
      {children}
    </button>
  )
}