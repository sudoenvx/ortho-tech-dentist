import React from "react"

type Variant = 'primary' | 'secondary' | 'danger' | 'warning'

interface BadgeProps {
    children: string
    prefix?: React.JSX.Element
    suffix?: React.JSX.Element
    variant?: Variant
}

const variantClasses: Record<Variant, string> = {
    primary: 'bg-primary-tint text-primary-tint-text',
    secondary: 'bg-secondary-tint text-secondary-tint-text',
    warning: 'bg-warning text-warning-text',
    danger: 'bg-danger text-danger-text',
}

function Badge({ children, variant='primary' }: BadgeProps) {
  return (
    <div className={`
        text-xs
        w-fit py-1 px-2 rounded-sm
        ${variantClasses[variant]}
    `}>{children}</div>
  )
}

export default Badge