import type { ReactNode } from "react"
import { Button } from "./button"
import React from "react"

// components/ui/ModalFooter.tsx — helper for consistent footer layouts
type Props = {
  onCancel: () => void
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  confirmDisabled?: boolean
  leading?: ReactNode  // for "View all shortcuts" style left-side actions
}

export function ModalFooter({
  onCancel, onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  confirmDisabled = false,
  leading,
}: Props) {
  return (
    <>
      {leading && <div className="mr-auto">{leading}</div>}
      <Button onClick={onCancel} variant="ghost">{cancelLabel}</Button>
      <Button
        onClick={onConfirm}
        variant={confirmVariant}
        disabled={confirmDisabled}

      >
        {confirmLabel}
      </Button>
    </>
  )
}
