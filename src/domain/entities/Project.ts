export type ProjectStatus =
  | 'planned'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'

export interface Project {
  id: string
  legalEntityId: string
  name: string
  code?: string
  status: ProjectStatus
  location?: string
  startDate?: string
  completionDate?: string
}
