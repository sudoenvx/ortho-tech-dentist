import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'light' | 'dark' | 'secondary'
}

export function Card({
  children,
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  const variantStyles = {
  default: 'bg-card',
    secondary: 'bg-card-secondary text-text',
    light: 'bg-surface',
    dark: 'bg-surface-dark'
  }

  return (
    <div className={`${variantStyles[variant]} px-2.5 py-2.5 rounded-xl ${className}`} {...props}>
      {children}
    </div>
  )
}
