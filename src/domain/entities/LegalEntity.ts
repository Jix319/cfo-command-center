export type LegalEntityStatus = 'active' | 'inactive'

export interface LegalEntity {
  id: string
  groupId: string
  name: string
  legalName: string
  registrationNumber?: string
  taxIdentifier?: string
  jurisdiction: string
  functionalCurrency: string
  status: LegalEntityStatus
}
