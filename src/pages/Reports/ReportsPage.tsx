import type { ReactElement } from 'react'
import EmptyState from '../../components/common/EmptyState'

export default function ReportsPage(): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Reports</h2>
      </div>
      <EmptyState
        title="Reports"
        description="This page is ready for future CFO workflows."
      />
    </div>
  )
}
