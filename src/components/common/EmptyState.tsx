import type { ReactElement, ComponentType } from 'react'

export interface EmptyStateProps {
  icon?: ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description?: string
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && <Icon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">{description}</p>}
    </div>
  )
}
