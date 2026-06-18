import type { ReactElement } from 'react'
import KPIGrid from './KPIGrid'
import { DASHBOARD_METRICS } from '../../data/dashboardMetrics'

export default function ExecutiveKPIs(): ReactElement {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Executive KPI Dashboard</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Executive KPIs</h2>
      </div>

      <KPIGrid metrics={DASHBOARD_METRICS} />
    </section>
  )
}
