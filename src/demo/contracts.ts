import type { Money } from '../domain/valueObjects/Money'
import { DEMO_CURRENCY } from './group'

export type DemoContractStatus = 'active' | 'completed' | 'on_hold'

export interface DemoVendorContract {
  id: string
  vendorId: string
  projectId: string
  legalEntityId: string
  contractNumber: string
  scope: string
  contractValue: Money
  status: DemoContractStatus
}

export const DEMO_VENDOR_CONTRACTS: DemoVendorContract[] = [
  {
    id: 'contract-geeta-civil',
    vendorId: 'vendor-aravali-constructions',
    projectId: 'project-geeta',
    legalEntityId: 'entity-shubhashish-homes',
    contractNumber: 'SGT/CIVIL/2025/014',
    scope: 'Civil structure package for Geeta Phase A',
    contractValue: { amountMinor: 680_000_000, currency: DEMO_CURRENCY },
    status: 'active',
  },
  {
    id: 'contract-prakash-mep',
    vendorId: 'vendor-pinkcity-mep',
    projectId: 'project-prakash',
    legalEntityId: 'entity-shubhashish-builders',
    contractNumber: 'SPR/MEP/2025/021',
    scope: 'MEP works for Prakash Phase A',
    contractValue: { amountMinor: 240_000_000, currency: DEMO_CURRENCY },
    status: 'active',
  },
  {
    id: 'contract-forest-design',
    vendorId: 'vendor-urban-design-studio',
    projectId: 'project-forest',
    legalEntityId: 'entity-shubhashish-estates',
    contractNumber: 'SFR/DESIGN/2026/006',
    scope: 'Architecture and design coordination',
    contractValue: { amountMinor: 58_000_000, currency: DEMO_CURRENCY },
    status: 'active',
  },
]
