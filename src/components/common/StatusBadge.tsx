import type { ReactElement } from 'react'
import clsx from 'clsx'

export type StatusVariant = 'success' | 'warning' | 'error' | 'info'

export interface StatusBadgeProps {
  variant: StatusVariant
  label: string
}

export default function StatusBadge({ variant, label }: StatusBadgeProps): ReactElement {
  const variantStyles = {
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  }

  return (
    <span className={clsx('inline-block rounded-full px-3 py-1 text-xs font-medium', variantStyles[variant])}>
      {label}
    </span>
  )
}
