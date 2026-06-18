import type { ReactElement } from 'react'
import ExecutiveKPIs from '../components/dashboard/ExecutiveKPIs'
import ChartContainer from '../components/charts/ChartContainer'
import SalesTrendChart from '../components/charts/SalesTrendChart'
import CashFlowChart from '../components/charts/CashFlowChart'
import { SALES_TREND_DATA, CASH_FLOW_DATA } from '../data/chartData'
import CriticalAlertsWidget from '../components/dashboard/CriticalAlertsWidget'
import UpcomingPaymentsWidget from '../components/dashboard/UpcomingPaymentsWidget'
import RecentApprovalsWidget from '../components/dashboard/RecentApprovalsWidget'

export default function DashboardPage(): ReactElement {
  return (
    <div className="space-y-6">
      <ExecutiveKPIs />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 col-span-1">
          <ChartContainer title="Sales Trend" subtitle="Monthly revenue trend">
            <SalesTrendChart data={SALES_TREND_DATA} />
          </ChartContainer>
        </div>
        <div className="md:col-span-4 col-span-1">
          <ChartContainer title="Cash Flow" subtitle="Inflow vs outflow">
            <CashFlowChart data={CASH_FLOW_DATA} />
          </ChartContainer>
        </div>

        <div className="md:col-span-4 col-span-1">
          <CriticalAlertsWidget />
        </div>
        <div className="md:col-span-4 col-span-1">
          <UpcomingPaymentsWidget />
        </div>
        <div className="md:col-span-4 col-span-1">
          <RecentApprovalsWidget />
        </div>
      </div>
    </div>
  )
}
