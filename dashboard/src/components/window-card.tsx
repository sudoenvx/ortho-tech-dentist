import React from 'react'
import { Card } from './card'

interface WindowCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    controls?: React.ReactNode
    className: string
    title?: string
}

function WindowCard({ className, children, controls, title }: WindowCardProps) {
  return (
    <Card className={`p-1! rounded-lg! bg-secondary! ${className}`}>
        {
            (title || controls) && (
                <div className="p-1 flex items-center justify-between mb-1">
                    <p className='text-secondary-text text-xs'>{title}</p>
                    {controls && controls}
                </div>
            )
        }
        <Card className='p-2! bg-[#f4f4f4]! rounded-md! rounded-bl-sm! rounded-br-sm!'>
            {children}
        </Card>
    </Card>
  )
}

export default WindowCard