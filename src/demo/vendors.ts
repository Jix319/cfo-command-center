import type { Vendor } from '../domain/entities/Vendor'

export const DEMO_VENDORS: Vendor[] = [
  {
    id: 'vendor-aravali-constructions',
    name: 'Aravali Constructions',
    legalName: 'Aravali Constructions Private Limited',
    taxIdentifier: '08AAGCA2211K1Z4',
    category: 'Civil contractor',
    status: 'active',
  },
  {
    id: 'vendor-pinkcity-mep',
    name: 'Pinkcity MEP',
    legalName: 'Pinkcity MEP Services LLP',
    taxIdentifier: '08AAPFP5523L1Z9',
    category: 'MEP contractor',
    status: 'active',
  },
  {
    id: 'vendor-jaipur-elevators',
    name: 'Jaipur Elevators',
    legalName: 'Jaipur Elevators Private Limited',
    taxIdentifier: '08AAECJ7788N1Z1',
    category: 'Elevators',
    status: 'active',
  },
  {
    id: 'vendor-urban-design-studio',
    name: 'Urban Design Studio',
    legalName: 'Urban Design Studio LLP',
    taxIdentifier: '08AAFFU1145G1Z8',
    category: 'Architecture',
    status: 'active',
  },
]
