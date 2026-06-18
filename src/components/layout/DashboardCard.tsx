import type { ReactElement, ReactNode } from 'react'
import clsx from 'clsx'

interface DashboardCardProps {
  title: string
  children?: ReactNode
  className?: string
}

export default function DashboardCard({ title, children, className }: DashboardCardProps): ReactElement {
  return (
    <div className={clsx('rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition p-6', className)}>
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="text-sm text-slate-500">{children ?? 'Coming Soon'}</div>
    </div>
  )
}
