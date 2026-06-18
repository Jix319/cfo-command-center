import type { ReactElement } from 'react'
import SectionTitle from '../../components/common/SectionTitle'
import BorrowingPositionCard from '../../components/treasury/BorrowingPositionCard'
import CashForecastCard from '../../components/treasury/CashForecastCard'
import LiquidityTimelineCard from '../../components/treasury/LiquidityTimelineCard'
import PaymentCalendarCard from '../../components/treasury/PaymentCalendarCard'
import TreasuryRecommendationsCard from '../../components/treasury/TreasuryRecommendationsCard'
import TreasurySummaryCard from '../../components/treasury/TreasurySummaryCard'
import { useTreasury } from '../../hooks/useTreasury'

export default function TreasuryPage(): ReactElement {
  const treasury = useTreasury()

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Treasury Command Center"
        subtitle="30-day payment readiness, borrowing headroom, and treasury actions"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <TreasurySummaryCard summary={treasury.output} />
        </div>
        <div className="md:col-span-8">
          <CashForecastCard forecasts={treasury.output.cashForecast} />
        </div>
        <div className="md:col-span-8">
          <PaymentCalendarCard payments={treasury.output.paymentCalendar} />
        </div>
        <div className="md:col-span-4">
          <BorrowingPositionCard facilities={treasury.output.borrowingPosition} />
        </div>
        <div className="md:col-span-8">
          <LiquidityTimelineCard forecasts={treasury.output.cashForecast} />
        </div>
        <div className="md:col-span-4">
          <TreasuryRecommendationsCard
            recommendations={treasury.output.treasuryRecommendations}
          />
        </div>
        <div className="md:col-span-12">
          <PaymentCalendarCard
            title="Upcoming Funding Requirements"
            payments={treasury.output.upcomingFundingRequirements}
          />
        </div>
      </div>
    </div>
  )
}
