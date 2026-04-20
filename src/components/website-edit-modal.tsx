import React, { useEffect, useState } from 'react'
import { Website, NewWebsiteInput } from '../types/website'
import { Modal } from './modal'
import { ModalFooter } from './modal-footers'
import { Input } from './input'
import { Switch, SwitchTile } from './switch'

interface WebsiteEditModalProps {
  open: boolean
  onClose: () => void
  website?: Website
  onSave: (input: NewWebsiteInput) => void
  isSubmitting?: boolean
}

export function WebsiteEditModal({
  open,
  onClose,
  website,
  onSave,
  isSubmitting = false,
}: WebsiteEditModalProps) {
  const isEditMode = !!website
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open && website) {
      setName(website.name)
      setLink(website.link || '')
      setIsActive(website.isActive)
    } else if (open && !website) {
      // New website mode
      setName('')
      setLink('')
      setIsActive(true)
    }
  }, [open, website])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      link: link.trim() || undefined,
      isActive,
    })
  }

  const handleCancel = () => {
    onClose()
  }

  const isDirty = isEditMode
    ? name !== website.name || link !== (website.link || '') || isActive !== website.isActive
    : name.trim() !== '' || link.trim() !== '' || !isActive

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={isEditMode ? 'Edit Website' : 'Create New Website'}
      size="md"
      footer={
        <ModalFooter
          onCancel={handleCancel}
          onConfirm={handleSave}
          confirmLabel={isEditMode ? 'Save Changes' : 'Create Website'}
          confirmDisabled={!isDirty || !name.trim() || isSubmitting}
        />
      }
    >
      <div className="space-y-4 p-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Website Name *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., SoftSmile, Orthero"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Link */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            Website Link (Optional)
          </label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            disabled={isSubmitting}
            type="url"
          />
          <p className="text-xs text-text-muted">
            This link is optional and is not used in dropdowns
          </p>
        </div>
        {/* Active Status */}
        <SwitchTile
          checked={isActive}
          onCheckedChange={setIsActive}
          label="Active Status"
          description={isActive
            ? 'This website appears in patient creation dropdown'
            : 'This website is hidden from patient creation dropdown'}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  )
}
