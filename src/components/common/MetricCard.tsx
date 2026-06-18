import type { ReactElement, ComponentType } from 'react'

export interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: ComponentType<React.SVGProps<SVGSVGElement>>
}

export default function MetricCard({ title, value, change, changeType = 'neutral', icon: Icon }: MetricCardProps): ReactElement {
  const changeColor = {
    increase: 'text-emerald-600 dark:text-emerald-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  }

  return (
    <div className="rounded-lg bg-white dark:bg-slate-800 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
      </div>
      <div className="mb-2">
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      {change && (
        <p className={`text-sm ${changeColor[changeType]}`}>
          {changeType === 'increase' && '↑'} {changeType === 'decrease' && '↓'} {change}
        </p>
      )}
    </div>
  )
}
