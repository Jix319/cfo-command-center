import type { ReactElement, ReactNode } from 'react'

export interface SectionTitleProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function SectionTitle({ title, subtitle, action }: SectionTitleProps): ReactElement {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
