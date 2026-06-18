import type { ReactElement } from 'react'
import EmptyState from '../../components/common/EmptyState'

export default function UploadPage(): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Upload</h2>
      </div>
      <EmptyState
        title="Upload"
        description="This page is ready for future CFO workflows."
      />
    </div>
  )
}
