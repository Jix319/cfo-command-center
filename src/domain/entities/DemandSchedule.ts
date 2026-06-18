import type { Money } from '../valueObjects/Money'

export type DemandStatus =
  | 'scheduled'
  | 'raised'
  | 'partially_collected'
  | 'collected'
  | 'overdue'
  | 'cancelled'

export interface DemandSchedule {
  id: string
  bookingId: string
  milestone: string
  dueDate: string
  amount: Money
  status: DemandStatus
}
