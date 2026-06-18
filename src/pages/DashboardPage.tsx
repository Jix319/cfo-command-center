import type { ReactElement } from 'react'
import ExecutiveKPIs from '../components/dashboard/ExecutiveKPIs'
import DashboardCard from '../components/layout/DashboardCard'

export default function DashboardPage(): ReactElement {
  return (
    <div className="space-y-6">
      <ExecutiveKPIs />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 col-span-1">
          <DashboardCard title="Sales Trend" />
        </div>
        <div className="md:col-span-4 col-span-1">
          <DashboardCard title="Cash Flow" />
        </div>

        <div className="md:col-span-4 col-span-1">
          <DashboardCard title="Critical Alerts" />
        </div>
        <div className="md:col-span-4 col-span-1">
          <DashboardCard title="Upcoming Payments" />
        </div>
        <div className="md:col-span-4 col-span-1">
          <DashboardCard title="Recent Approvals" />
        </div>
      </div>
    </div>
  )
}
