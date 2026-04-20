import React, { useEffect, useState } from 'react'
import { PatientCase } from '../types/case'
import { Website } from '../types/website'
import { subscribeToWebsites } from '../services/websites'
import { Modal } from './modal'
import { ModalFooter } from './modal-footers'
import { Input } from './input'
import { DropdownMenu, DropdownMenuCheckItem } from './dropdown-menu'

interface CaseEditModalProps {
  open: boolean
  onClose: () => void
  caseItem: PatientCase
  onSave: (caseItem: PatientCase) => void
}

// const DATE_FMT = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
const initials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export function CaseEditModal({ open, onClose, caseItem, onSave }: CaseEditModalProps) {
  const [patientName, setPatientName] = useState(caseItem.patientName)
  const [doctorName, setDoctorName]   = useState(caseItem.doctorName)
  const [websiteId, setWebsiteId] = useState<string>(caseItem.websiteId)
  const [websites, setWebsites] = useState<Website[]>([])

  // Subscribe to websites
  useEffect(() => {
    const unsubscribe = subscribeToWebsites({
      onData: (websites) => {
        setWebsites(websites)
      },
      onError: (error) => {
        console.error('Failed to fetch websites:', error)
      },
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (open) {
      setPatientName(caseItem.patientName)
      setDoctorName(caseItem.doctorName)
      setWebsiteId(caseItem.websiteId)
    }
  }, [open, caseItem])

  const handleSave = () => {
    onSave({ ...caseItem, patientName, doctorName, websiteId, updatedAt: new Date() })
  }

  const handleCancel = () => {
    setPatientName(caseItem.patientName)
    setDoctorName(caseItem.doctorName)
    setWebsiteId(caseItem.websiteId)
    onClose()
  }

  const isDirty =
    patientName !== caseItem.patientName ||
    doctorName  !== caseItem.doctorName  ||
    websiteId !== caseItem.websiteId

  const selectedWebsite = websites.find((w) => w.id === websiteId)

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={
        <div className="flex items-center gap-2 px-1">
          Edit Case Record
        </div>
      }
      size="md"
      footer={
        <ModalFooter
          onCancel={handleCancel}
          onConfirm={handleSave}
          confirmLabel="Save Changes"
          confirmDisabled={!isDirty}
        />
      }
    >
      {/* Patient banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <div className="w-9 h-9 rounded-full bg-primary-tint text-primary-tint-text flex items-center justify-center text-xs font-semibold shrink-0">
          {initials(patientName || '?')}
        </div>
        <div>
          <p className="text-sm font-medium text-text">{patientName || 'New Patient'}</p>
          <p className="text-xs text-text-muted font-mono">Case ID: {caseItem.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Patient Name */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Patient Name
          </label>
          <Input
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
        </div>

        {/* Doctor Name */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Doctor Name
          </label>
          <Input
            value={doctorName}
            onChange={e => setDoctorName(e.target.value)}
            placeholder="Enter doctor name"
          />
        </div>

        {/* Website */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Website / Source
          </label>
          <DropdownMenu
            trigger={
              <div className="h-7 w-full border border-border rounded px-2 text-xs text-text bg-surface flex items-center justify-between gap-2 transition-colors">
                <span>{selectedWebsite?.name || 'Select a website'}</span>
                <svg className="w-4 h-4 opacity-50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            }
            triggerClassName="w-full justify-start"
            side="bottom"
            align="start"
          >
            {websites.map((website) => (
              <DropdownMenuCheckItem 
                key={website.id}
                checked={websiteId === website.id} 
                onCheckedChange={() => setWebsiteId(website.id)}
              >
                {website.name}
              </DropdownMenuCheckItem>
            ))}
          </DropdownMenu>
        </div>


        {/* Timestamps — read-only */}
        {/* <div className="col-span-2 border-t border-border pt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Created</p>
            <div className="h-8 rounded-lg px-3 text-xs text-text-muted bg-card-hover flex items-center">
              {DATE_FMT.format(new Date(caseItem.createdAt))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Last Updated</p>
            <div className="h-8 rounded-lg px-3 text-xs text-text-muted bg-card-hover flex items-center">
              {DATE_FMT.format(new Date(caseItem.updatedAt))}
            </div>
          </div>
        </div> */}
      </div>
    </Modal>
  )
}