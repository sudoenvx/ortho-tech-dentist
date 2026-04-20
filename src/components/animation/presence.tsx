// components/ui/animation/Presence.tsx
// Reusable animated wrapper using Framer Motion.
// Handles mount/unmount animations for any overlay or panel.

import { motion, AnimatePresence, type Transition, Variants } from 'motion/react'
import React from 'react'
import { type ReactNode } from 'react'

// ── Shared transition base ─────────────────────────────────────
const transition: Transition = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1] // material standard easing
}

// ── Named variant presets ──────────────────────────────────────
export const presenceVariants: Record<string, unknown> = {
  // Modal — scales up from 96% with fade
  modal: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
      exit: { opacity: 0, transition: { ...transition, duration: 0.14 } }
    },
    panel: {
      hidden: { opacity: 0, scale: 1, y: 0 },
      visible: { opacity: 1, scale: 1, y: 0, transition },
      exit: { opacity: 0, scale: 1, y: 4, transition: { ...transition, duration: 0.14 } }
    }
  },

  // Drawer — slides in from a side
  drawerRight: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
      exit: { opacity: 0, transition: { ...transition, duration: 0.14 } }
    },
    panel: {
      hidden: { opacity: 0, x: '100%' },
      visible: { opacity: 1, x: 0, transition },
      exit: { opacity: 0, x: '100%', transition: { ...transition, duration: 0.14 } }
    }
  },

  drawerLeft: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
      exit: { opacity: 0, transition: { ...transition, duration: 0.14 } }
    },
    panel: {
      hidden: { opacity: 0, x: '-100%' },
      visible: { opacity: 1, x: 0, transition },
      exit: { opacity: 0, x: '-100%', transition: { ...transition, duration: 0.14 } }
    }
  },

  // Command palette / spotlight — drops from top
  spotlight: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
      exit: { opacity: 0, transition: { ...transition, duration: 0.1 } }
    },
    panel: {
      hidden: { opacity: 0, scale: 0.97, y: -8 },
      visible: { opacity: 1, scale: 1, y: 0, transition },
      exit: { opacity: 0, scale: 0.97, y: -8, transition: { ...transition, duration: 0.12 } }
    }
  },

  // Toast / snackbar — slides up from bottom
  toast: {
    overlay: null, // toasts have no overlay
    panel: {
      hidden: { opacity: 0, y: 16, scale: 0.96 },
      visible: { opacity: 1, y: 0, scale: 1, transition },
      exit: { opacity: 0, y: 8, scale: 0.97, transition: { ...transition, duration: 0.12 } }
    }
  },

  // Dropdown / popover — fades in with tiny y nudge
  dropdown: {
    overlay: null,
    panel: {
      hidden: { opacity: 0, y: -4 },
      visible: { opacity: 1, y: 0, transition: { ...transition, duration: 4 } },
      exit: { opacity: 0, y: -4, transition: { ...transition, duration: 0.1 } }
    }
  }
}

export type PresenceVariantKey = keyof typeof presenceVariants

// ── AnimatedOverlay ────────────────────────────────────────────
// The dim backdrop — use when the variant has an overlay
type AnimatedOverlayProps = {
  variant: PresenceVariantKey
  onClick?: () => void
  className?: string
  children: ReactNode
}

export function AnimatedOverlay({
  variant,
  onClick,
  className,
  children
}: AnimatedOverlayProps) {
  const overlayVariants = (presenceVariants[variant] as { overlay: unknown }).overlay
  if (!overlayVariants) return <>{children}</>

  return (
    <motion.div
      variants={overlayVariants as Variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── AnimatedPanel ──────────────────────────────────────────────
// The content panel — always present inside AnimatedOverlay or standalone
type AnimatedPanelProps = {
  variant: PresenceVariantKey
  className?: string
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
}

export function AnimatedPanel({
  variant,
  className,
  children,
  onClick
}: AnimatedPanelProps) {
  return (
    <motion.div
      variants={(presenceVariants[variant] as { panel: unknown }).panel as Variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// ── Presence ───────────────────────────────────────────────────
// Wraps AnimatePresence — the single exit animation gate.
// Always wrap your conditional render with this.
type PresenceProps = {
  show: boolean
  children: ReactNode
}

export function Presence({ show, children }: PresenceProps) {
  return <AnimatePresence initial={false}>{show && children}</AnimatePresence>
}
