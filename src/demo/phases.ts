import type { Phase } from '../domain/entities/Phase'

export const DEMO_PHASES: Phase[] = [
  {
    id: 'phase-geeta-a',
    projectId: 'project-geeta',
    name: 'Geeta Phase A',
    code: 'SGT-A',
    status: 'active',
    startDate: '2024-04-01T00:00:00.000Z',
    completionDate: '2026-12-31T00:00:00.000Z',
  },
  {
    id: 'phase-geeta-b',
    projectId: 'project-geeta',
    name: 'Geeta Phase B',
    code: 'SGT-B',
    status: 'planned',
    startDate: '2026-10-01T00:00:00.000Z',
    completionDate: '2028-03-31T00:00:00.000Z',
  },
  {
    id: 'phase-prakash-a',
    projectId: 'project-prakash',
    name: 'Prakash Phase A',
    code: 'SPR-A',
    status: 'active',
    startDate: '2023-10-01T00:00:00.000Z',
    completionDate: '2026-09-30T00:00:00.000Z',
  },
  {
    id: 'phase-forest-a',
    projectId: 'project-forest',
    name: 'Forest Phase A',
    code: 'SFR-A',
    status: 'active',
    startDate: '2025-01-15T00:00:00.000Z',
    completionDate: '2028-09-30T00:00:00.000Z',
  },
]
