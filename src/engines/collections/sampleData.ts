import { DEMO_UNITS } from '../../demo/bookings'
import { DEMO_COLLECTION_RECOVERY_ITEMS } from '../../demo/collections'
import { DEMO_CUSTOMERS } from '../../demo/customers'
import {
  DEMO_AS_OF_DATE,
  DEMO_CURRENCY,
  DEMO_GROUP_ID,
} from '../../demo/group'
import { DEMO_PROJECTS } from '../../demo/projects'
import type { CollectionCase, CollectionsInput } from './types'

function toCollectionCase(
  item: (typeof DEMO_COLLECTION_RECOVERY_ITEMS)[number],
): CollectionCase {
  const customer = DEMO_CUSTOMERS.find(
    (candidate) => candidate.id === item.customerId,
  )
  const project = DEMO_PROJECTS.find(
    (candidate) => candidate.id === item.projectId,
  )
  const unit = DEMO_UNITS.find((candidate) => candidate.id === item.unitId)

  if (!customer || !project || !unit) {
    throw new Error(`Collection demo data is incomplete for ${item.id}.`)
  }

  return {
    id: item.id,
    customer,
    project,
    unit,
    amountDue: { amountMinor: item.amountDueMinor, currency: DEMO_CURRENCY },
    expectedCollectionDate: item.expectedCollectionDate,
    probability: item.probability,
    delayReason: item.delayReason,
    recommendedAction: item.recommendedAction,
    stage: item.stage,
    amountCollected: {
      amountMinor: item.amountCollectedMinor,
      currency: DEMO_CURRENCY,
    },
  }
}

export const COLLECTION_CASES: CollectionCase[] =
  DEMO_COLLECTION_RECOVERY_ITEMS.map(toCollectionCase)

export const COLLECTIONS_SAMPLE_INPUT: CollectionsInput = {
  groupId: DEMO_GROUP_ID,
  reportingCurrency: DEMO_CURRENCY,
  asOfDate: DEMO_AS_OF_DATE,
  todayTarget: { amountMinor: 30_000_000, currency: DEMO_CURRENCY },
  monthTarget: { amountMinor: 100_000_000, currency: DEMO_CURRENCY },
  collectionCases: COLLECTION_CASES,
}
