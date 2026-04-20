import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/button';
import { DropdownMenu, DropdownMenuItem } from '../../../components/dropdown-menu';
import { Input } from '../../../components/input';
import { Modal } from '../../../components/modal';
import { addCase } from '../../../services/cases';
import { subscribeToWebsites } from '../../../services/websites';
import { NewPatientCaseInput } from '../../../types/case';
import { Website } from '../../../types/website';
import { ChevronDown } from 'lucide-react';

interface CreateCaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateCaseModal({ isOpen, onClose }: CreateCaseModalProps) {
  const [websites, setWebsites] = useState<Website[]>([])
  const [formData, setFormData] = useState<NewPatientCaseInput>({
    patientName: '',
    doctorName: '',
    websiteId: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Subscribe to websites
  useEffect(() => {
    const unsubscribe = subscribeToWebsites({
      onData: (websites) => {
        setWebsites(websites)
        // Set default websiteId to first active website
        const firstActive = websites.find((w) => w.isActive)
        if (firstActive && !formData.websiteId) {
          setFormData((prev) => ({ ...prev, websiteId: firstActive.id }))
        }
      },
      onError: (error) => {
        console.error('Failed to fetch websites:', error)
      },
    })

    return () => unsubscribe()
  }, [])

  // Filter only active websites
  const activeWebsites = websites.filter((w) => w.isActive)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientName.trim() || !formData.doctorName.trim() || !formData.websiteId) return

    setIsSubmitting(true)
    try {
      await addCase(formData)
      onClose()
      const firstActive = websites.find((w) => w.isActive)
      setFormData({
        patientName: '',
        doctorName: '',
        websiteId: firstActive?.id || '',
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
      const firstActive = websites.find((w) => w.isActive)
      setFormData({
        patientName: '',
        doctorName: '',
        websiteId: firstActive?.id || '',
      })
    }
  }

  const selectedWebsite = websites.find((w) => w.id === formData.websiteId)

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
            <Button type="submit" form="create-case-form" disabled={isSubmitting || !formData.patientName.trim() || !formData.doctorName.trim() || !formData.websiteId}>
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
                {selectedWebsite?.name || 'Select a website'}
                <span className="text-text-faint">
                  <ChevronDown className='w-4 h-4' />
                </span>
              </div>
            }
          >
            {activeWebsites.length > 0 ? (
              activeWebsites.map((website) => (
                <DropdownMenuItem
                  key={website.id}
                  selected={website.id === formData.websiteId}
                  onSelect={() =>
                    setFormData((prev: NewPatientCaseInput) => ({ ...prev, websiteId: website.id }))
                  }
                >
                  {website.name}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-2 py-2 text-xs text-text-muted">No active websites available</div>
            )}
          </DropdownMenu>
        </div>
      </form>
    </Modal>
  )
}