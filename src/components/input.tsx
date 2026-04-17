import React from 'react'
import { type InputHTMLAttributes, forwardRef, useId } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, wrapperClassName, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const id = externalId ?? generatedId

    return (
      <>
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={id} className="text-[10px] font-medium text-text-muted tracking-wider">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={[
            'bg-input rounded text-text text-[13px] font-[inherit]',
            'px-2 py-1 outline-none ',
            'placeholder:text-text-faint',
            'transition-colors duration-100',
            'border border-border focus:border-primary',
            'disabled:bg-surface-raised disabled:border-surface-raised disabled:text-text-faint disabled:cursor-not-allowed',
            error ? 'border-danger! border placeholder:text-muted!' : '',
            className
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {error && <span className="text-[11px] text-danger">{error}</span>}
        {!error && hint && <span className="text-[11px] text-text-faint">{hint}</span>}
      </div>
      </>
    )
  }
)

Input.displayName = 'Input'
