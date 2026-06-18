export type CustomerType = 'individual' | 'organization'

export interface Customer {
  id: string
  name: string
  customerType: CustomerType
  taxIdentifier?: string
  email?: string
  phone?: string
}
