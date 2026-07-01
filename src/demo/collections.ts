import type { Collection } from '../domain/entities/Collection'
import type {
  CollectionDelayReason,
  CollectionRecommendedAction,
  CollectionStage,
} from '../engines/collections/types'
import { DEMO_CURRENCY } from './group'

export interface DemoCollectionRecoveryItem {
  id: string
  customerId: string
  projectId: string
  unitId: string
  bookingId: string
  amountDueMinor: number
  expectedCollectionDate: string
  probability: number
  delayReason: CollectionDelayReason
  recommendedAction: CollectionRecommendedAction
  stage: CollectionStage
  amountCollectedMinor: number
}

export interface DemoCashInflowForecast {
  id: string
  legalEntityId: string
  projectId?: string
  description: string
  expectedDate: string
  amountMinor: number
  confidence: 'committed' | 'probable' | 'possible'
}

export const DEMO_COLLECTIONS: Collection[] = [
  {
    id: 'collection-priya-token',
    customerId: 'customer-priya-nair',
    bookingId: 'booking-priya-forest-1103',
    bankAccountId: 'account-forest-collection',
    collectionDate: '2026-07-01T10:00:00.000Z',
    amount: { amountMinor: 6_400_000, currency: DEMO_CURRENCY },
    status: 'allocated',
    reference: 'NEFT-FOREST-0701-01',
  },
  {
    id: 'collection-sapphire-part',
    customerId: 'customer-sapphire-ventures',
    bookingId: 'booking-sapphire-forest-retail',
    bankAccountId: 'account-forest-collection',
    collectionDate: '2026-07-02T00:00:00.000Z',
    amount: { amountMinor: 8_000_000, currency: DEMO_CURRENCY },
    status: 'received',
    reference: 'RTGS-FOREST-0702-03',
  },
]

export const DEMO_COLLECTION_RECOVERY_ITEMS: DemoCollectionRecoveryItem[] = [
  {
    id: 'collection-case-rohan',
    customerId: 'customer-rohan-mehta',
    projectId: 'project-geeta',
    unitId: 'unit-geeta-a-1204',
    bookingId: 'booking-rohan-geeta-1204',
    amountDueMinor: 8_500_000,
    expectedCollectionDate: '2026-07-01T12:00:00.000Z',
    probability: 0.85,
    delayReason: 'Payment Awaited',
    recommendedAction: 'Call Customer',
    stage: 'Customer Committed',
    amountCollectedMinor: 0,
  },
  {
    id: 'collection-case-ananya',
    customerId: 'customer-ananya-shah',
    projectId: 'project-geeta',
    unitId: 'unit-geeta-b-0802',
    bookingId: 'booking-ananya-geeta-0802',
    amountDueMinor: 12_000_000,
    expectedCollectionDate: '2026-07-01T15:00:00.000Z',
    probability: 0.65,
    delayReason: 'Loan Processing',
    recommendedAction: 'Call Banker',
    stage: 'Loan Processing',
    amountCollectedMinor: 0,
  },
  {
    id: 'collection-case-vikram',
    customerId: 'customer-vikram-rao',
    projectId: 'project-prakash',
    unitId: 'unit-prakash-c-1501',
    bookingId: 'booking-vikram-prakash-1501',
    amountDueMinor: 7_250_000,
    expectedCollectionDate: '2026-07-02T00:00:00.000Z',
    probability: 0.75,
    delayReason: 'Registration Pending',
    recommendedAction: 'Schedule Registration',
    stage: 'Registration Scheduled',
    amountCollectedMinor: 2_500_000,
  },
  {
    id: 'collection-case-neha',
    customerId: 'customer-neha-kapoor',
    projectId: 'project-prakash',
    unitId: 'unit-prakash-d-0605',
    bookingId: 'booking-neha-prakash-0605',
    amountDueMinor: 5_800_000,
    expectedCollectionDate: '2026-06-30T00:00:00.000Z',
    probability: 0.4,
    delayReason: 'Customer Delay',
    recommendedAction: 'Sales Follow-up',
    stage: 'Demand Raised',
    amountCollectedMinor: 0,
  },
  {
    id: 'collection-case-kunal',
    customerId: 'customer-kunal-industries',
    projectId: 'project-geeta',
    unitId: 'unit-geeta-r-0201',
    bookingId: 'booking-kunal-geeta-retail',
    amountDueMinor: 18_500_000,
    expectedCollectionDate: '2026-07-03T00:00:00.000Z',
    probability: 0.3,
    delayReason: 'Legal Issue',
    recommendedAction: 'Legal Follow-up',
    stage: 'Demand Raised',
    amountCollectedMinor: 0,
  },
  {
    id: 'collection-case-priya',
    customerId: 'customer-priya-nair',
    projectId: 'project-forest',
    unitId: 'unit-forest-e-1103',
    bookingId: 'booking-priya-forest-1103',
    amountDueMinor: 6_400_000,
    expectedCollectionDate: '2026-07-01T10:00:00.000Z',
    probability: 1,
    delayReason: 'Payment Awaited',
    recommendedAction: 'Call Customer',
    stage: 'Allocated',
    amountCollectedMinor: 6_400_000,
  },
  {
    id: 'collection-case-arjun',
    customerId: 'customer-arjun-malhotra',
    projectId: 'project-prakash',
    unitId: 'unit-prakash-a-1702',
    bookingId: 'booking-arjun-prakash-1702',
    amountDueMinor: 9_750_000,
    expectedCollectionDate: '2026-07-08T00:00:00.000Z',
    probability: 0.7,
    delayReason: 'Documentation Pending',
    recommendedAction: 'Sales Follow-up',
    stage: 'Customer Committed',
    amountCollectedMinor: 0,
  },
  {
    id: 'collection-case-sapphire',
    customerId: 'customer-sapphire-ventures',
    projectId: 'project-forest',
    unitId: 'unit-forest-r-0104',
    bookingId: 'booking-sapphire-forest-retail',
    amountDueMinor: 14_200_000,
    expectedCollectionDate: '2026-07-11T00:00:00.000Z',
    probability: 0.9,
    delayReason: 'Payment Awaited',
    recommendedAction: 'Call Customer',
    stage: 'Payment Received',
    amountCollectedMinor: 8_000_000,
  },
]

export const DEMO_CASH_INFLOW_FORECASTS: DemoCashInflowForecast[] = [
  {
    id: 'inflow-customer-commitments-week',
    legalEntityId: 'entity-shubhashish-homes',
    projectId: 'project-geeta',
    description: 'Committed customer collections',
    expectedDate: '2026-07-03T00:00:00.000Z',
    amountMinor: 180_000_000,
    confidence: 'committed',
  },
  {
    id: 'inflow-prakash-milestone',
    legalEntityId: 'entity-shubhashish-builders',
    projectId: 'project-prakash',
    description: 'Expected construction milestone receipts',
    expectedDate: '2026-07-10T00:00:00.000Z',
    amountMinor: 225_000_000,
    confidence: 'probable',
  },
  {
    id: 'inflow-forest-launch',
    legalEntityId: 'entity-shubhashish-estates',
    projectId: 'project-forest',
    description: 'Potential launch collections',
    expectedDate: '2026-07-18T00:00:00.000Z',
    amountMinor: 150_000_000,
    confidence: 'possible',
  },
  {
    id: 'inflow-quarter-receipts',
    legalEntityId: 'entity-shubhashish-homes',
    description: 'Committed quarterly customer receipts',
    expectedDate: '2026-08-15T00:00:00.000Z',
    amountMinor: 300_000_000,
    confidence: 'committed',
  },
]
