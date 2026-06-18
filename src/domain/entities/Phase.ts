export type PhaseStatus = 'planned' | 'active' | 'completed' | 'on_hold'

export interface Phase {
  id: string
  projectId: string
  name: string
  code?: string
  status: PhaseStatus
  startDate?: string
  completionDate?: string
}
