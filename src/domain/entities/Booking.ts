import type { Money } from '../valueObjects/Money'

export type BookingStatus =
  | 'reserved'
  | 'confirmed'
  | 'cancelled'
  | 'completed'

export interface Booking {
  id: string
  projectId: string
  unitId: string
  customerId: string
  bookingDate: string
  status: BookingStatus
  agreementValue: Money
}
