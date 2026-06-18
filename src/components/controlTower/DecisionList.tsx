import type { ReactElement } from 'react'
import type { Recommendation as DomainRecommendation } from '../../domain/core/Recommendation'
import type { Recommendation as BlockedCashRecommendation } from '../../engines/core/Recommendation'
import DashboardCard from '../layout/DashboardCard'
import StatusBadge, { type StatusVariant } from '../common/StatusBadge'

type ControlTowerRecommendation =
  | DomainRecommendation
  | BlockedCashRecommendation

interface DecisionListProps {
  recommendations: ControlTowerRecommendation[]
}

const priorityOrder = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const priorityVariants: Record<
  ControlTowerRecommendation['priority'],
  StatusVariant
> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
}

function getTitle(recommendation: ControlTowerRecommendation): string {
  return 'title' in recommendation
    ? recommendation.title
    : recommendation.action
}

function getDescription(recommendation: ControlTowerRecommendation): string {
  return 'description' in recommendation
    ? recommendation.description
    : recommendation.rationale
}

function getKey(recommendation: ControlTowerRecommendation): string {
  return 'id' in recommendation ? recommendation.id : recommendation.code
}

export default function DecisionList({
  recommendations,
}: DecisionListProps): ReactElement {
  const sortedRecommendations = [...recommendations].sort(
    (left, right) =>
      priorityOrder[left.priority] - priorityOrder[right.priority],
  )

  return (
    <DashboardCard title="Top Decisions">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {sortedRecommendations.slice(0, 5).map((recommendation) => (
          <div key={getKey(recommendation)} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {getTitle(recommendation)}
              </p>
              <StatusBadge
                variant={priorityVariants[recommendation.priority]}
                label={recommendation.priority}
              />
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {getDescription(recommendation)}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
