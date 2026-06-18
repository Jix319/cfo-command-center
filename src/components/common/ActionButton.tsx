import type { ReactElement, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  label: string
}

export default function ActionButton({ variant = 'primary', label, className, ...props }: ActionButtonProps): ReactElement {
  const variantStyles = {
    primary: 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  }

  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}>
      {label}
    </button>
  )
}
