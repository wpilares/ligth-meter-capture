import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
          {label}
        </span>
      )}
      <input
        className={`w-full px-3 py-2.5 rounded-lg border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-light-accent-primary/50 dark:focus:ring-dark-accent-primary/50 ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-light-border dark:border-dark-border focus:border-light-accent-primary dark:focus:border-dark-accent-primary'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
