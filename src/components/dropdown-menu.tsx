// DropdownMenu.tsx
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { createPortal } from 'react-dom'

// ── Types ──────────────────────────────────────────────────────────

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

type DropdownMenuProps = {
	trigger: ReactNode
	children: ReactNode
	side?: Side
	align?: Align
	offset?: number
	triggerClassName?: string
}

type DropdownMenuItemProps = {
	icon?: ReactNode
	shortcut?: string
	variant?: 'default' | 'danger'
	selected?: boolean
	disabled?: boolean
	onSelect?: () => void
	children: ReactNode
}

type DropdownMenuCheckItemProps = {
	checked: boolean
	onCheckedChange: (v: boolean) => void
	children: ReactNode
	group?: string // pass the same group string for radioyle single-select
}

// ── Internal context ───────────────────────────────────────────────

const CloseCtx = createContext<(() => void) | null>(null)

// ── Position helper ────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max)
}

function calcPos(
	triggerRect: DOMRect,
	menuRect: DOMRect,
	side: Side,
	align: Align,
	offset: number,
): { top: number; left: number } {
	const vw = window.innerWidth
	const vh = window.innerHeight
	const pad = 6
	let top = 0,
		left = 0

	if (side === 'bottom' || side === 'top') {
		top = side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - menuRect.height - offset

		left =
			align === 'start'
				? triggerRect.left
				: align === 'end'
					? triggerRect.right - menuRect.width
					: triggerRect.left + (triggerRect.width - menuRect.width) / 2
	} else {
		left = side === 'right' ? triggerRect.right + offset : triggerRect.left - menuRect.width - offset

		top =
			align === 'start'
				? triggerRect.top
				: align === 'end'
					? triggerRect.bottom - menuRect.height
					: triggerRect.top + (triggerRect.height - menuRect.height) / 2
	}

	return {
		top: clamp(top, pad, vh - menuRect.height - pad),
		left: clamp(left, pad, vw - menuRect.width - pad),
	}
}

// ── DropdownMenu ───────────────────────────────────────────────────

export function DropdownMenu({
	trigger,
	children,
	side = 'bottom',
	align = 'start',
	offset = 4,
	triggerClassName,
}: DropdownMenuProps) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, left: 0 })
	const triggerRef = useRef<HTMLButtonElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	const close = useCallback(() => setOpen(false), [])

	// position after menu mounts
	useLayoutEffect(() => {
		if (!open || !triggerRef.current || !menuRef.current) return
		const tr = triggerRef.current.getBoundingClientRect()
		const mr = menuRef.current.getBoundingClientRect()
		setPos(calcPos(tr, mr, side, align, offset))
		menuRef.current.focus()
	}, [open, side, align, offset])

	// reposition on resize / scroll
	useEffect(() => {
		if (!open) return
		const update = () => {
			if (!triggerRef.current || !menuRef.current) return
			const tr = triggerRef.current.getBoundingClientRect()
			const mr = menuRef.current.getBoundingClientRect()
			setPos(calcPos(tr, mr, side, align, offset))
		}
		window.addEventListener('resize', update)
		window.addEventListener('scroll', update, true)
		return () => {
			window.removeEventListener('resize', update)
			window.removeEventListener('scroll', update, true)
		}
	}, [open, side, align, offset])

	// outside click / escape
	useEffect(() => {
		if (!open) return
		const onDown = (e: MouseEvent) => {
			if (!menuRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) close()
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				close()
				return
			}
			const items = [
				...(menuRef.current?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not(:disabled)') ??
					[]),
			]
			const idx = items.indexOf(document.activeElement as HTMLButtonElement)
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				items[(idx + 1) % items.length]?.focus()
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				items[(idx - 1 + items.length) % items.length]?.focus()
			}
		}
		document.addEventListener('mousedown', onDown)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('mousedown', onDown)
			document.removeEventListener('keydown', onKey)
		}
	}, [open, close])

	const ctx = useMemo(() => close, [close])

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
				className={`not-draggable inline-flex items-center ${triggerClassName ?? ''}`}
			>
				{trigger}
			</button>

			{createPortal(
      <AnimatePresence>
        {open && (
          <CloseCtx.Provider value={ctx}>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'tween', duration: 0.25 }}
              exit={{ y: -10, opacity: 0 }}
              ref={menuRef}
              role="menu"
              tabIndex={-1}
              style={{ top: pos.top, left: pos.left }}
              className="fixed z-50 min-w-[200px] p-1 outline-none bg-surface  border-border rounded-md flex flex-col gap-1 shadow-xs shadow-secondary/80"
            >
              {children}
            </motion.div>
          </CloseCtx.Provider>
        )}
      </AnimatePresence>,
      document.body,
    )}
		</>
	)
}

// ── DropdownMenuItem ───────────────────────────────────────────────

export function DropdownMenuItem({
	icon,
	shortcut,
	variant = 'default',
	selected = false,
	disabled,
	onSelect,
	children,
}: DropdownMenuItemProps) {
	const close = useContext(CloseCtx)

	return (
		<button
			type="button"
			role="menuitem"
			disabled={disabled}
			onClick={() => {
				if (!disabled) {
					onSelect?.()
					close?.()
				}
			}}
			className={`

        flex w-full items-center justify-between gap-2
        rounded px-1.5 py-0.5 text-[13px] text-left lowercase
        border-none cursor-pointer font-[inherit] outline-none
        transition-colors duration-100
        disabled:pointer-events-none disabled:opacity-40
        ${
			variant === 'danger'
				? 'bg-danger-tint text-danger-tint-text hover:bg-danger focus:bg-danger hover:text-danger-text focus:text-danger-text'
				: selected
					? 'bg-primary text-primary-text hover:bg-primary focus:bg-primary'
					: 'text-text font-medium hover:bg-card-hover hover:text-primary-tint-text focus:bg-surface-raised'
		}
      `}
		>
			<span className="flex items-center gap-2">
				{icon && (
					<span className="w-4 h-4 text-primary-tint-text! flex items-center justify-center opacity-65 shrink-0 [&>svg]:w-full [&>svg]:h-full">
						{icon}
					</span>
				)}
				{children}
			</span>
			{shortcut && (
				<kbd
					className={`
          text-[11px] font-[inherit] px-1.5 py-px rounded-sm
          bg-surface-raised
          ${variant === 'danger' ? 'text-danger/60 bg-danger-tint border-danger-tint' : 'text-text-muted'}
        `}
				>
					{shortcut}
				</kbd>
			)}
		</button>
	)
}

// ── DropdownMenuCheckItem ──────────────────────────────────────────
// Works as both a toggle (no group) and radio (with group).

export function DropdownMenuCheckItem({ checked, onCheckedChange, children }: DropdownMenuCheckItemProps) {
	const close = useContext(CloseCtx)

	return (
		<button
			type="button"
			role="menuitemcheckbox"
			aria-checked={checked}
			onClick={() => {
				onCheckedChange?.(!checked)
				close?.()
			}}
			className={`
        flex w-full items-center gap-2
        rounded px-1.5 py-0.5 text-[13px] text-left
        border-none cursor-pointer font-[inherit] outline-none
        hover:bg-surface-raised focus:bg-surface-raised
        transition-colors duration-100
		${checked ? 'bg-primary text-primary-text' : 'text-text hover:bg-card-hover hover:text-primary-tint-text focus:bg-surface-raised'}
      `}
		>
			{/* checkmark — takes up space even when unchecked to keep alignment */}
			<span
				className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 ${checked ? 'text-primary-text' : 'text-text-muted'} transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-full h-full">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</span>
			{children}
		</button>
	)
}

// ── DropdownMenuSeparator ──────────────────────────────────────────

export function DropdownMenuSeparator() {
	return <div role="separator" className="h-[0.5px] bg-border my-1" />
}

// ── DropdownMenuLabel ──────────────────────────────────────────────

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
	return (
		<div className="px-2 pt-1.5 pb-0 text-[10px] font-bold tracking-widest uppercase text-text-faint select-none">
			{children}
		</div>
	)
}
