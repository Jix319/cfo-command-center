import type { Customer } from '../domain/entities/Customer'

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'customer-rohan-mehta',
    name: 'Rohan Mehta',
    customerType: 'individual',
    email: 'rohan.mehta@example.com',
    phone: '+91 98290 11001',
  },
  {
    id: 'customer-ananya-shah',
    name: 'Ananya Shah',
    customerType: 'individual',
    email: 'ananya.shah@example.com',
    phone: '+91 98290 11002',
  },
  {
    id: 'customer-vikram-rao',
    name: 'Vikram Rao',
    customerType: 'individual',
    email: 'vikram.rao@example.com',
    phone: '+91 98290 11003',
  },
  {
    id: 'customer-neha-kapoor',
    name: 'Neha Kapoor',
    customerType: 'individual',
    email: 'neha.kapoor@example.com',
    phone: '+91 98290 11004',
  },
  {
    id: 'customer-kunal-industries',
    name: 'Kunal Industries',
    customerType: 'organization',
    taxIdentifier: '08AAHCK4421M1Z7',
    email: 'accounts@kunalindustries.example.com',
  },
  {
    id: 'customer-priya-nair',
    name: 'Priya Nair',
    customerType: 'individual',
    email: 'priya.nair@example.com',
    phone: '+91 98290 11006',
  },
  {
    id: 'customer-arjun-malhotra',
    name: 'Arjun Malhotra',
    customerType: 'individual',
    email: 'arjun.malhotra@example.com',
    phone: '+91 98290 11007',
  },
  {
    id: 'customer-sapphire-ventures',
    name: 'Sapphire Ventures',
    customerType: 'organization',
    taxIdentifier: '08AAMCS7782Q1Z6',
    email: 'finance@sapphireventures.example.com',
  },
]
