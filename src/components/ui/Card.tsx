import type { HTMLAttributes, Ref } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export const Card = ({ className = '', children, ref, ...props }: CardProps) => {
  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-light-border dark:border-dark-border bg-light-bg-card dark:bg-dark-bg-card p-6 shadow-sm transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
