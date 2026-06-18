import type { ReactElement } from 'react'
import SectionTitle from '../../components/common/SectionTitle'
import CollectionsPipelineCard from '../../components/collections/CollectionsPipelineCard'
import CollectionsSummaryCard from '../../components/collections/CollectionsSummaryCard'
import CollectionsTargetCard from '../../components/collections/CollectionsTargetCard'
import DelayReasonsCard from '../../components/collections/DelayReasonsCard'
import RecoveryTable from '../../components/collections/RecoveryTable'
import { useCollections } from '../../hooks/useCollections'

export default function CollectionsPage(): ReactElement {
  const collections = useCollections()

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Collections Command Center"
        subtitle="Prioritized recovery actions and collection performance"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <CollectionsSummaryCard summary={collections.output} />
        </div>
        <div className="md:col-span-4">
          <CollectionsTargetCard summary={collections.output} />
        </div>

        <div className="md:col-span-12">
          <RecoveryTable recoveryCases={collections.output.recoveryCases} />
        </div>

        <div className="md:col-span-6">
          <DelayReasonsCard delayReasons={collections.output.delayReasons} />
        </div>
        <div className="md:col-span-6">
          <CollectionsPipelineCard pipeline={collections.output.pipeline} />
        </div>
      </div>
    </div>
  )
}
