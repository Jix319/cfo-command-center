import type { Customer } from '../../domain/entities/Customer'
import type { Project } from '../../domain/entities/Project'
import type { Unit } from '../../domain/entities/Unit'
import type { CollectionCase, CollectionsInput } from './types'

const INR = 'INR'

const projects: Project[] = [
  {
    id: 'project-heights',
    legalEntityId: 'entity-projects',
    name: 'Aurora Heights',
    status: 'active',
    location: 'Mumbai',
  },
  {
    id: 'project-greens',
    legalEntityId: 'entity-projects',
    name: 'Aurora Greens',
    status: 'active',
    location: 'Pune',
  },
]

const customers: Customer[] = [
  { id: 'customer-1', name: 'Rohan Mehta', customerType: 'individual' },
  { id: 'customer-2', name: 'Ananya Shah', customerType: 'individual' },
  { id: 'customer-3', name: 'Vikram Rao', customerType: 'individual' },
  { id: 'customer-4', name: 'Neha Kapoor', customerType: 'individual' },
  { id: 'customer-5', name: 'Kunal Industries', customerType: 'organization' },
  { id: 'customer-6', name: 'Priya Nair', customerType: 'individual' },
  { id: 'customer-7', name: 'Arjun Malhotra', customerType: 'individual' },
  { id: 'customer-8', name: 'Sapphire Ventures', customerType: 'organization' },
]

const units: Unit[] = [
  { id: 'unit-1', projectId: 'project-heights', unitNumber: 'A-1204', unitType: '3 BHK', status: 'booked' },
  { id: 'unit-2', projectId: 'project-heights', unitNumber: 'B-0802', unitType: '2 BHK', status: 'booked' },
  { id: 'unit-3', projectId: 'project-greens', unitNumber: 'C-1501', unitType: '3 BHK', status: 'booked' },
  { id: 'unit-4', projectId: 'project-greens', unitNumber: 'D-0605', unitType: '2 BHK', status: 'booked' },
  { id: 'unit-5', projectId: 'project-heights', unitNumber: 'R-0201', unitType: 'Retail', status: 'booked' },
  { id: 'unit-6', projectId: 'project-greens', unitNumber: 'E-1103', unitType: '3 BHK', status: 'booked' },
  { id: 'unit-7', projectId: 'project-heights', unitNumber: 'A-1702', unitType: '4 BHK', status: 'booked' },
  { id: 'unit-8', projectId: 'project-greens', unitNumber: 'R-0104', unitType: 'Retail', status: 'booked' },
]

function collectionCase(
  index: number,
  amountDue: number,
  amountCollected: number,
  expectedCollectionDate: string,
  probability: number,
  delayReason: CollectionCase['delayReason'],
  recommendedAction: CollectionCase['recommendedAction'],
  stage: CollectionCase['stage'],
): CollectionCase {
  const unit = units[index]

  return {
    id: `collection-case-${index + 1}`,
    customer: customers[index],
    project:
      projects.find((project) => project.id === unit.projectId) ?? projects[0],
    unit,
    amountDue: { amountMinor: amountDue, currency: INR },
    expectedCollectionDate,
    probability,
    delayReason,
    recommendedAction,
    stage,
    amountCollected: { amountMinor: amountCollected, currency: INR },
  }
}

export const COLLECTION_CASES: CollectionCase[] = [
  collectionCase(0, 8_500_000, 0, '2026-06-19T12:00:00.000Z', 0.85, 'Payment Awaited', 'Call Customer', 'Customer Committed'),
  collectionCase(1, 12_000_000, 0, '2026-06-19T15:00:00.000Z', 0.65, 'Loan Processing', 'Call Banker', 'Loan Processing'),
  collectionCase(2, 7_250_000, 2_500_000, '2026-06-20T00:00:00.000Z', 0.75, 'Registration Pending', 'Schedule Registration', 'Registration Scheduled'),
  collectionCase(3, 5_800_000, 0, '2026-06-18T00:00:00.000Z', 0.4, 'Customer Delay', 'Sales Follow-up', 'Demand Raised'),
  collectionCase(4, 18_500_000, 0, '2026-06-21T00:00:00.000Z', 0.3, 'Legal Issue', 'Legal Follow-up', 'Demand Raised'),
  collectionCase(5, 6_400_000, 6_400_000, '2026-06-19T10:00:00.000Z', 1, 'Payment Awaited', 'Call Customer', 'Allocated'),
  collectionCase(6, 9_750_000, 0, '2026-06-24T00:00:00.000Z', 0.7, 'Documentation Pending', 'Sales Follow-up', 'Customer Committed'),
  collectionCase(7, 14_200_000, 8_000_000, '2026-06-27T00:00:00.000Z', 0.9, 'Payment Awaited', 'Call Customer', 'Payment Received'),
]

export const COLLECTIONS_SAMPLE_INPUT: CollectionsInput = {
  groupId: 'group-aurora',
  reportingCurrency: INR,
  asOfDate: '2026-06-19T09:00:00.000Z',
  todayTarget: { amountMinor: 30_000_000, currency: INR },
  monthTarget: { amountMinor: 100_000_000, currency: INR },
  collectionCases: COLLECTION_CASES,
}
