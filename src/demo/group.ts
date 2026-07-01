import type { Group } from '../domain/entities/Group'

export const DEMO_CURRENCY = 'INR'
export const DEMO_AS_OF_DATE = '2026-07-01T09:00:00.000Z'
export const DEMO_GROUP_ID = 'group-house-of-shubhashish'

export const HOUSE_OF_SHUBHASHISH_GROUP: Group = {
  id: DEMO_GROUP_ID,
  name: 'House of Shubhashish',
  legalName: 'House of Shubhashish Group',
  reportingCurrency: DEMO_CURRENCY,
  legalEntityIds: [
    'entity-shubhashish-homes',
    'entity-shubhashish-builders',
    'entity-shubhashish-estates',
    'entity-shubhashish-corporate',
  ],
}
