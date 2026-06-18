import type { ReactElement } from 'react'
import SectionTitle from '../components/common/SectionTitle'
import BankPositionSummaryCard from '../components/controlTower/BankPositionSummaryCard'
import BlockedCashSummaryCard from '../components/controlTower/BlockedCashSummaryCard'
import CashOverviewCard from '../components/controlTower/CashOverviewCard'
import DecisionList from '../components/controlTower/DecisionList'
import FinanceHealthCard from '../components/controlTower/FinanceHealthCard'
import LiquiditySummaryCard from '../components/controlTower/LiquiditySummaryCard'
import OpportunityList from '../components/controlTower/OpportunityList'
import RiskList from '../components/controlTower/RiskList'
import {
  useBankPosition,
  useFinanceHealth,
} from '../hooks/useBankPosition'
import { useBlockedCash } from '../hooks/useBlockedCash'
import { useLiquidity } from '../hooks/useLiquidity'

export default function DashboardPage(): ReactElement {
  const bankPosition = useBankPosition()
  const liquidity = useLiquidity()
  const blockedCash = useBlockedCash()
  const financeHealth = useFinanceHealth(
    blockedCash.score.value,
    bankPosition.score.value,
    liquidity.score.value,
  )

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Executive Control Tower"
        subtitle="Group financial health, liquidity, risks, and actions"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <FinanceHealthCard {...financeHealth} />
        </div>
        <div className="md:col-span-8">
          <CashOverviewCard
            netDeployableCash={bankPosition.output.netDeployableCash}
            immediatelyAvailableCash={bankPosition.output.availableCash}
            projectedClosingCash={liquidity.output.projectedClosingCash}
            blockedCash={blockedCash.output.blockedAmount}
          />
        </div>

        <div className="md:col-span-4">
          <BankPositionSummaryCard
            summary={bankPosition.output}
            status={bankPosition.score.band}
          />
        </div>
        <div className="md:col-span-4">
          <LiquiditySummaryCard summary={liquidity.output} />
        </div>
        <div className="md:col-span-4">
          <BlockedCashSummaryCard result={blockedCash} />
        </div>

        <div className="md:col-span-4">
          <DecisionList
            recommendations={[
              ...blockedCash.recommendations,
              ...bankPosition.recommendations,
              ...liquidity.recommendations,
            ]}
          />
        </div>
        <div className="md:col-span-4">
          <RiskList
            risks={[
              ...blockedCash.risks,
              ...bankPosition.risks,
              ...liquidity.risks,
            ]}
          />
        </div>
        <div className="md:col-span-4">
          <OpportunityList
            opportunities={[
              ...bankPosition.opportunities,
              ...liquidity.opportunities,
            ]}
          />
        </div>
      </div>
    </div>
  )
}
