import React, { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { PatientCase, CaseStep, PRODUCTION_STEP_OPTIONS } from '../types/case'
import { Modal } from './modal'
import { ModalFooter } from './modal-footers'
import { Input } from './input'

interface StepEditModalProps {
  open: boolean
  onClose: () => void
  caseItem: PatientCase
  onSave: (caseItem: PatientCase) => void
}

function StepCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'w-4 h-4 rounded border-2 transition-all flex items-center justify-center shrink-0 mt-px',
        checked ? 'bg-primary border-primary' : 'border-secondary-tint hover:border-primary/60',
      )}
    >
      {checked && (
        <svg className="w-[10px] h-[10px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

// const DATE_FMT = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
const initials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export function StepEditModal({ open, onClose, caseItem, onSave }: StepEditModalProps) {
  const [steps, setSteps] = useState(caseItem.steps)

  useEffect(() => {
    if (open) setSteps(caseItem.steps)
  }, [open, caseItem.steps])

  const completedCount = PRODUCTION_STEP_OPTIONS.filter(s => steps[s.value as CaseStep].completed).length

  const handleStepToggle = (stepName: CaseStep, completed: boolean) =>
    setSteps(prev => ({ ...prev, [stepName]: { ...prev[stepName], completed } }))

  const handleNotesChange = (stepName: CaseStep, notes: string) =>
    setSteps(prev => ({ ...prev, [stepName]: { ...prev[stepName], notes: notes || undefined } }))

  const handleSave = () => onSave({ ...caseItem, steps, updatedAt: new Date() })

  const handleCancel = () => { setSteps(caseItem.steps); onClose() }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={
        <div className="flex items-center px-1 text-sm">
          Edit Case Steps
        </div>
      }
      size="lg"
      className="max-h-[600px]"
      footer={<ModalFooter onCancel={handleCancel} onConfirm={handleSave} confirmLabel="Save Changes" />}
    >
      {/* Patient banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <div className="w-9 h-9 rounded-full bg-primary-tint text-primary-tint-text flex items-center justify-center text-xs font-semibold flex-shrink-0">
          {initials(caseItem.patientName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{caseItem.patientName}</p>
          <p className="text-xs text-text-muted">Dr. {caseItem.doctorName} · {caseItem.websiteName}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-text-faint font-medium">Progress</p>
          <p className="text-sm font-semibold text-text">{completedCount} / {PRODUCTION_STEP_OPTIONS.length}</p>
        </div>
      </div>

      {/* Steps */}
      <div>
        {PRODUCTION_STEP_OPTIONS.map((stepOption, index) => {
          const stepName = stepOption.value as CaseStep
          const stepData = steps[stepName]
          return (
            <div
              key={stepName}
              className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0"
            >
              <StepCheckbox
                checked={stepData?.completed || false}
                onChange={completed => handleStepToggle(stepName, completed)}
              />
              <div className="flex-1 flex flex-col min-w-0">
                <label htmlFor={'step' + index.toString()} className="text-xs font-medium text-secondary mb-1.5">{stepOption.label}</label>
                <Input
                  placeholder={`Notes for ${stepOption.label}…`}
                  value={stepData?.notes || ''}
                  wrapperClassName="h-7"
                  id={'step' + index.toString()}
                  onChange={e => handleNotesChange(stepName, e.target.value)}
                  className="text-xs placeholder:text-[12px]"
                />
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}