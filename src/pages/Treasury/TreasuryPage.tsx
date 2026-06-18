import type { ReactElement } from 'react'
import EmptyState from '../../components/common/EmptyState'

export default function TreasuryPage(): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Treasury</h2>
      </div>
      <EmptyState
        title="Treasury"
        description="This page is ready for future CFO workflows."
      />
    </div>
  )
}
