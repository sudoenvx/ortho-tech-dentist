// components/ui/Modal.tsx
import {
  useEffect, useCallback,
  type ReactNode, type MouseEvent
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { Presence, AnimatedOverlay, AnimatedPanel } from './animation/presence'
import React from 'react'
import { cn } from '../lib/cn'
type ModalSize = 'sm' | 'md' | 'lg'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnOverlay?: boolean
  className?: string
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'w-[380px]',
  md: 'w-[480px]',
  lg: 'w-[600px]',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  // closeOnOverlay = true,
  className,
}: ModalProps) {

  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Body scroll lock
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleOverlayClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // if (closeOnOverlay && (e.target as HTMLElement).hasAttribute('data-overlay'))
    //   onClose()

    e.stopPropagation()
  }, [])

  return createPortal(
    <Presence show={open}>
      <AnimatedOverlay
        variant="modal"
        className="fixed inset-0 z-50 flex items-center justify-center overlay"
      >
        {/* Click zone for overlay dismiss — data-overlay attr used as selector */}
        <div
          data-overlay
          className="absolute inset-0"
          onClick={handleOverlayClick}
        />

        <AnimatedPanel
          variant="modal"
          className={cn(
            'relative flex flex-col bg-surface rounded',
            'max-w-[calc(100vw-32px)] max-h-[calc(100vh-48px)]',
            sizeMap[size],
            className,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-1.5 py-1.5 border-b border-border shrink-0">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-text">
              {title}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-6.5 h-6.5 flex items-center justify-center rounded-sm
                         text-text bg-danger/30 hover:bg-danger/40
                         border-none cursor-pointer transition-colors"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 px-2 py-2 border-t border-border shrink-0">
              {footer}
            </div>
          )}
        </AnimatedPanel>
      </AnimatedOverlay>
    </Presence>,
    document.body,
  )
}
