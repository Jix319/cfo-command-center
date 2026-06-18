import type { ReactElement } from 'react'
import EmptyState from '../../components/common/EmptyState'

export default function SettingsPage(): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>
      <EmptyState
        title="Settings"
        description="This page is ready for future CFO workflows."
      />
    </div>
  )
}
