// Switch.tsx
import { useId } from 'react'
import { Card } from './card'
import React from 'react'

type SwitchProps = {
  checked:         boolean
  onCheckedChange: (v: boolean) => void
  size?:           'sm' | 'md'
  disabled?:       boolean
  className?:      string
}

export function Switch({
  checked,
  onCheckedChange,
  size      = 'md',
  disabled,
  className,
}: SwitchProps) {
  const id = useId()

  const trackSize = size === 'sm'
    ? 'w-7 h-4'
    : 'w-9 h-5'

  const thumbSize = size === 'sm'
    ? 'w-[10px] h-[10px] top-[3px] left-[3px] data-[on=true]:translate-x-3'
    : 'w-[14px] h-[14px] top-[3px] left-[3px] data-[on=true]:translate-x-4'

  return (
    <label
      htmlFor={id}
      className={`
        inline-flex items-center cursor-pointer select-none
        ${disabled ? 'opacity-45 pointer-events-none' : ''}
        ${className ?? ''}
      `}
    >
      {/* track */}
      <div className={`
        relative ${trackSize} rounded-[10px] flex-shrink-0
        transition-colors duration-150
        ${checked ? 'bg-st-primary' : 'bg-st-border-strong'}
      `}>
        {/* thumb */}
        <div className={`
          absolute ${thumbSize} bg-white rounded-full
          transition-transform duration-150
          ${checked
            ? size === 'sm' ? 'translate-x-3' : 'translate-x-4'
            : 'translate-x-0'}
        `} />
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          onChange={e => onCheckedChange(e.target.checked)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
    </label>
  )
}

type SwitchTileProps = {
  checked:         boolean
  onCheckedChange: (v: boolean) => void
  label:           string
  description?:    string
  size?:           'sm' | 'md'
  disabled?:       boolean
  className?:      string
}

export function SwitchTile({
  checked,
  onCheckedChange,
  label,
  description,
  size,
  disabled,
  className,
}: SwitchTileProps) {
  return (
    <Card className={`
      flex items-center justify-between gap-2 cursor-pointer select-none
      bg-st-card hover:bg-st-card-secondary rounded-sm p-3
      ${disabled ? 'opacity-45 pointer-events-none' : ''}
      ${className ?? ''}
    `}>
      <div className="flex flex-col">
        <span className="text-sm text-st-text leading-tight font-semibold">{label}</span>
        {description && <span className="text-xs max-w-sm text-st-text-muted mt-0.5">{description}</span>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        size={size}
        disabled={disabled}
      />
    </Card>
  )
}
