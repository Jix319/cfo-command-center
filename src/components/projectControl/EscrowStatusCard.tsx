import type { ReactElement } from 'react'
import type { ProjectControlProject } from '../../engines/projectControl/types'
import StatusBadge from '../common/StatusBadge'
import DashboardCard from '../layout/DashboardCard'

interface EscrowStatusCardProps {
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

export default function EscrowStatusCard({
  project,
  currency,
}: EscrowStatusCardProps): ReactElement {
  const metrics = [
    ['Escrow Balance', formatMoney(project.escrowRera.escrowBalanceMinor, currency)],
    ['Withdrawable Amount', formatMoney(project.escrowRera.withdrawableAmountMinor, currency)],
    ['Blocked Amount', formatMoney(project.escrowRera.blockedAmountMinor, currency)],
    ['Next Opportunity', project.escrowRera.nextWithdrawalOpportunity],
  ]

  return (
    <DashboardCard title="Escrow & RERA">
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <StatusBadge variant="info" label={`Architect: ${project.escrowRera.architectCertificateStatus}`} />
        <StatusBadge variant="info" label={`CA: ${project.escrowRera.caCertificateStatus}`} />
      </div>
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
