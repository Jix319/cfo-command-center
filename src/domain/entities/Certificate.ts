import type { Money } from '../valueObjects/Money'

export type CertificateType =
  | 'architect'
  | 'chartered_accountant'
  | 'engineer'
  | 'statutory'
  | 'other'

export type CertificateStatus =
  | 'not_submitted'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'expired'

export interface Certificate {
  id: string
  projectId: string
  certificateType: CertificateType
  status: CertificateStatus
  issueDate?: string
  expiryDate?: string
  certifiedAmount?: Money
  reference?: string
}
