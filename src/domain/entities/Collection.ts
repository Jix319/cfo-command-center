import type { Money } from '../valueObjects/Money'

export type CollectionStatus =
  | 'pending'
  | 'received'
  | 'allocated'
  | 'reversed'

export interface Collection {
  id: string
  customerId: string
  bookingId?: string
  demandScheduleId?: string
  bankAccountId: string
  collectionDate: string
  amount: Money
  status: CollectionStatus
  reference?: string
}
