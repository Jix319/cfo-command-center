import type { ReactElement } from 'react'
import DashboardCard from '../components/layout/DashboardCard'

export default function DashboardPage(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Row 1: 4 equal cards */}
      <div className="md:col-span-3 col-span-1">
        <DashboardCard title="Revenue KPI" />
      </div>
      <div className="md:col-span-3 col-span-1">
        <DashboardCard title="Collections KPI" />
      </div>
      <div className="md:col-span-3 col-span-1">
        <DashboardCard title="Receivables KPI" />
      </div>
      <div className="md:col-span-3 col-span-1">
        <DashboardCard title="Cash Position KPI" />
      </div>

      {/* Row 2: Sales Trend (8), Cash Flow (4) */}
      <div className="md:col-span-8 col-span-1">
        <DashboardCard title="Sales Trend" />
      </div>
      <div className="md:col-span-4 col-span-1">
        <DashboardCard title="Cash Flow" />
      </div>

      {/* Row 3: 3 columns of 4 */}
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
  )
}
