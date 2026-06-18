import type { ReactElement } from 'react'
import type { RecoveryCase } from '../../engines/collections/types'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

interface RecoveryTableProps {
  recoveryCases: RecoveryCase[]
}

const priorityVariants: Record<RecoveryCase['priority'], StatusVariant> = {
  Critical: 'error',
  High: 'error',
  Medium: 'warning',
  Low: 'info',
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

export default function RecoveryTable({
  recoveryCases,
}: RecoveryTableProps): ReactElement {
  return (
    <DashboardCard title="Recovery Queue">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Project / Unit</th>
              <th className="pb-3 font-medium">Amount Due</th>
              <th className="pb-3 font-medium">Expected</th>
              <th className="pb-3 font-medium">Probability</th>
              <th className="pb-3 font-medium">Delay</th>
              <th className="pb-3 font-medium">Action</th>
              <th className="pb-3 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {recoveryCases.map((recoveryCase) => (
              <tr key={recoveryCase.id} className="text-xs">
                <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                  {recoveryCase.customerName}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">
                  {recoveryCase.projectName} · {recoveryCase.unitNumber}
                </td>
                <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                  {formatMoney(
                    recoveryCase.amountDue.amountMinor,
                    recoveryCase.amountDue.currency,
                  )}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">
                  {formatDate(recoveryCase.expectedCollectionDate)}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">
                  {(recoveryCase.probability * 100).toFixed(0)}%
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">
                  {recoveryCase.delayReason}
                </td>
                <td className="py-3 font-medium text-slate-700 dark:text-slate-200">
                  {recoveryCase.recommendedAction}
                </td>
                <td className="py-3">
                  <StatusBadge
                    variant={priorityVariants[recoveryCase.priority]}
                    label={recoveryCase.priority}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
