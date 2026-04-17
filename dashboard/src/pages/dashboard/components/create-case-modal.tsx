import React, { useState } from 'react'
import { Button } from '../../../components/button';
import { DropdownMenu, DropdownMenuItem } from '../../../components/dropdown-menu';
import { Input } from '../../../components/input';
import { Modal } from '../../../components/modal';
import { addCase } from '../../../services/cases';
import { WebsiteName, NewPatientCaseInput } from '../../../types/case';
import { ChevronDown } from 'lucide-react';

interface CreateCaseModalProps {
  isOpen: boolean
  onClose: () => void
}

const WEBSITE_OPTIONS: Array<{ value: WebsiteName; label: string }> = [
  { value: 'softSmile', label: 'SoftSmile' },
  { value: 'orthero', label: 'Orthero' },
  { value: 'DSmile', label: 'DSmile' },
]

export function CreateCaseModal({ isOpen, onClose }: CreateCaseModalProps) {
  const [formData, setFormData] = useState<NewPatientCaseInput>({
    patientName: '',
    doctorName: '',
    websiteName: 'softSmile',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientName.trim() || !formData.doctorName.trim()) return

    setIsSubmitting(true)
    try {
      await addCase(formData)
      onClose()
      setFormData({
        patientName: '',
        doctorName: '',
        websiteName: 'softSmile',
      })
    } catch (error) {
      console.error('Failed to create case:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setFormData({
        patientName: '',
        doctorName: '',
        websiteName: 'softSmile',
      })
    }
  }

  return (
    <Modal
        open={isOpen}
        onClose={handleClose}
        title="Create New Case"
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" form="create-case-form" disabled={isSubmitting || !formData.patientName.trim() || !formData.doctorName.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Case'}
            </Button>
          </div>
        }
    >
      <form id="create-case-form" onSubmit={handleSubmit} className="space-y-4 p-3">
        <div>
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Patient Name
          </label>
          <Input
            wrapperClassName="w-full"
            className="w-full"
            value={formData.patientName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: NewPatientCaseInput) => ({ ...prev, patientName: e.target.value }))
            }
            placeholder="Enter patient name"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Doctor Name
          </label>
          <Input
            wrapperClassName="w-full"
            className="w-full"
            value={formData.doctorName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: NewPatientCaseInput) => ({ ...prev, doctorName: e.target.value }))
            }
            placeholder="Enter doctor name"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Website
          </label>
          <DropdownMenu
            triggerClassName="w-full"
            trigger={
              <div className="bg-input w-60 rounded text-text text-[13px] font-[inherit] px-2 py-1 outline-none border border-border focus:border-primary cursor-pointer flex items-center justify-between">
                {WEBSITE_OPTIONS.find((opt) => opt.value === formData.websiteName)?.label}
                <span className="text-text-faint">
                  <ChevronDown className='w-4 h-4' />
                </span>
              </div>
            }
          >
            {WEBSITE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                selected={option.value === formData.websiteName}
                onSelect={() =>
                  setFormData((prev: NewPatientCaseInput) => ({ ...prev, websiteName: option.value }))
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </div>
      </form>
    </Modal>
  )
}