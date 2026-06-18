import type { ReactElement } from 'react'
import type { Risk as DomainRisk } from '../../domain/core/Risk'
import type { Risk as BlockedCashRisk } from '../../engines/core/Risk'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

type ControlTowerRisk = DomainRisk | BlockedCashRisk

interface RiskListProps {
  risks: ControlTowerRisk[]
}

const severityVariants: Record<
  ControlTowerRisk['severity'],
  StatusVariant
> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
}

function getKey(risk: ControlTowerRisk): string {
  return 'id' in risk ? risk.id : risk.code
}

export default function RiskList({ risks }: RiskListProps): ReactElement {
  return (
    <DashboardCard title="Top Risks">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {risks.slice(0, 5).map((risk) => (
          <div key={getKey(risk)} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {risk.title}
              </p>
              <StatusBadge
                variant={severityVariants[risk.severity]}
                label={risk.severity}
              />
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
