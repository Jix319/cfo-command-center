import type { Money } from '../valueObjects/Money'

export type UnitStatus =
  | 'available'
  | 'reserved'
  | 'booked'
  | 'cancelled'
  | 'handed_over'

export interface Unit {
  id: string
  projectId: string
  phaseId?: string
  unitNumber: string
  unitType: string
  status: UnitStatus
  area?: number
  saleValue?: Money
}
