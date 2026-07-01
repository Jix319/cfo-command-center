import type { Project } from '../domain/entities/Project'

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'project-geeta',
    legalEntityId: 'entity-shubhashish-homes',
    name: 'Shubhashish Geeta',
    code: 'SGT',
    status: 'active',
    location: 'Mansarovar Extension, Jaipur',
    startDate: '2024-04-01T00:00:00.000Z',
    completionDate: '2028-03-31T00:00:00.000Z',
  },
  {
    id: 'project-prakash',
    legalEntityId: 'entity-shubhashish-builders',
    name: 'Shubhashish Prakash',
    code: 'SPR',
    status: 'active',
    location: 'Ajmer Road, Jaipur',
    startDate: '2023-10-01T00:00:00.000Z',
    completionDate: '2027-12-31T00:00:00.000Z',
  },
  {
    id: 'project-forest',
    legalEntityId: 'entity-shubhashish-estates',
    name: 'Shubhashish Forest',
    code: 'SFR',
    status: 'active',
    location: 'Sanganer, Jaipur',
    startDate: '2025-01-15T00:00:00.000Z',
    completionDate: '2029-06-30T00:00:00.000Z',
  },
]
