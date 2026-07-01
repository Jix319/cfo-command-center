import type { ReactElement } from 'react'
import type { ProjectControlProject } from '../../engines/projectControl/types'
import DashboardCard from '../layout/DashboardCard'

interface InventoryStatusCardProps {
  project: ProjectControlProject
  currency: string
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export default function InventoryStatusCard({
  project,
  currency,
}: InventoryStatusCardProps): ReactElement {
  const metrics = [
    ['Available Units', String(project.inventory.availableUnits)],
    ['Booked Units', String(project.inventory.bookedUnits)],
    ['Registered Units', String(project.inventory.registeredUnits)],
    ['Unsold Units', String(project.inventory.unsoldUnits)],
    ['Unsold Inventory Value', formatMoney(project.inventory.unsoldInventoryValueMinor, currency)],
  ]

  return (
    <DashboardCard title="Inventory Position">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
              {value}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
