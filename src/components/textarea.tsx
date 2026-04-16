import React from 'react'
import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  hint?:  string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const id = externalId ?? generatedId

    return (
      <div className="flex flex-col gap-0.75">
        {label && (
          <label htmlFor={id} className="text-[11px] text-text font-bold">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={[
            'bg-input rounded-sm border border-input-border text-text text-[13.5px] font-[inherit]',
            'px-2 py-1 outline-none w-full',
            'placeholder:text-text-faint',
            'resize-y min-h-20 leading-relaxed',
            'transition-colors duration-100',
            // 'hover:border-borderrong',
            'focus:border-secondary',
            'disabled:bg-surface-raised disabled:text-text-faint disabled:cursor-not-allowed',
            error ? 'bg-danger-tint!' : 'border-border',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && (
          <span className="text-[11px] text-danger">{error}</span>
        )}
        {!error && hint && (
          <span className="text-[11px] text-text-faint">{hint}</span>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
