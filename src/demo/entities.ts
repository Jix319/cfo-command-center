import type { LegalEntity } from '../domain/entities/LegalEntity'
import { DEMO_CURRENCY, DEMO_GROUP_ID } from './group'

export const DEMO_LEGAL_ENTITIES: LegalEntity[] = [
  {
    id: 'entity-shubhashish-corporate',
    groupId: DEMO_GROUP_ID,
    name: 'Shubhashish Corporate',
    legalName: 'Shubhashish Corporate Services Private Limited',
    registrationNumber: 'U70100RJ2016PTC000101',
    taxIdentifier: '08ABJCS1001A1Z5',
    jurisdiction: 'India',
    functionalCurrency: DEMO_CURRENCY,
    status: 'active',
  },
  {
    id: 'entity-shubhashish-homes',
    groupId: DEMO_GROUP_ID,
    name: 'Shubhashish Homes',
    legalName: 'Shubhashish Homes Private Limited',
    registrationNumber: 'U45201RJ2011PTC000221',
    taxIdentifier: '08ABJCS2002B1Z4',
    jurisdiction: 'India',
    functionalCurrency: DEMO_CURRENCY,
    status: 'active',
  },
  {
    id: 'entity-shubhashish-builders',
    groupId: DEMO_GROUP_ID,
    name: 'Shubhashish Builders',
    legalName: 'Shubhashish Builders LLP',
    registrationNumber: 'AAR-2026',
    taxIdentifier: '08ABJFS3003C1Z3',
    jurisdiction: 'India',
    functionalCurrency: DEMO_CURRENCY,
    status: 'active',
  },
  {
    id: 'entity-shubhashish-estates',
    groupId: DEMO_GROUP_ID,
    name: 'Shubhashish Estates',
    legalName: 'Shubhashish Estate Developers Private Limited',
    registrationNumber: 'U70109RJ2019PTC000551',
    taxIdentifier: '08ABJCS4004D1Z2',
    jurisdiction: 'India',
    functionalCurrency: DEMO_CURRENCY,
    status: 'active',
  },
]
