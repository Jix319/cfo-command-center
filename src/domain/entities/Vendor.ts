export type VendorStatus = 'active' | 'inactive' | 'blocked'

export interface Vendor {
  id: string
  name: string
  legalName?: string
  taxIdentifier?: string
  category?: string
  status: VendorStatus
}
