import type { LucideIcon } from 'lucide-react'
import type { StatusVariant } from '../components/common/StatusBadge'

export interface AlertItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  severity: StatusVariant
  severityLabel: string
  timestamp: string
}

export interface PaymentItem {
  id: string
  vendor: string
  amount: string
  dueDate: string
}

export interface ApprovalItem {
  id: string
  document: string
  status: StatusVariant
  statusLabel: string
  timestamp: string
}
