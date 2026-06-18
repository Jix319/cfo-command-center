import {
  AlertTriangle,
  BadgeIndianRupee,
  CircleAlert,
  ClockAlert,
  ShieldAlert,
} from 'lucide-react'
import type { AlertItem, PaymentItem, ApprovalItem } from '../types/widget'

export const CRITICAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-001',
    icon: AlertTriangle,
    title: 'High vendor invoice variance',
    description: 'Invoice total is 18% above the approved purchase order.',
    severity: 'error',
    severityLabel: 'Critical',
    timestamp: '2 minutes ago',
  },
  {
    id: 'alert-002',
    icon: ClockAlert,
    title: 'Receivables aging exceeds threshold',
    description: 'Six customer balances have moved beyond 90 days overdue.',
    severity: 'warning',
    severityLabel: 'Warning',
    timestamp: '15 minutes ago',
  },
  {
    id: 'alert-003',
    icon: BadgeIndianRupee,
    title: 'Cash flow forecast below minimum',
    description: 'Projected closing balance is below the treasury floor.',
    severity: 'error',
    severityLabel: 'Critical',
    timestamp: '1 hour ago',
  },
  {
    id: 'alert-004',
    icon: ShieldAlert,
    title: 'Compliance filing requires review',
    description: 'GST reconciliation contains unresolved exceptions.',
    severity: 'warning',
    severityLabel: 'Warning',
    timestamp: '3 hours ago',
  },
  {
    id: 'alert-005',
    icon: CircleAlert,
    title: 'Approval SLA breached',
    description: 'A capital request has remained pending for over 48 hours.',
    severity: 'info',
    severityLabel: 'Review',
    timestamp: '5 hours ago',
  },
]

export const UPCOMING_PAYMENTS: PaymentItem[] = [
  {
    id: 'payment-001',
    vendor: 'Apex Infrastructure',
    amount: '₹24,50,000',
    dueDate: 'Tomorrow',
  },
  {
    id: 'payment-002',
    vendor: 'Global Logistics India',
    amount: '₹8,95,000',
    dueDate: '20 Jun',
  },
  {
    id: 'payment-003',
    vendor: 'Nimbus Cloud Services',
    amount: '₹4,80,000',
    dueDate: '21 Jun',
  },
  {
    id: 'payment-004',
    vendor: 'Vertex Consulting',
    amount: '₹3,25,000',
    dueDate: '22 Jun',
  },
  {
    id: 'payment-005',
    vendor: 'Metro Facilities',
    amount: '₹1,72,500',
    dueDate: '24 Jun',
  },
]

export const RECENT_APPROVALS: ApprovalItem[] = [
  {
    id: 'approval-001',
    document: 'CAPEX request · Mumbai expansion',
    status: 'success',
    statusLabel: 'Approved',
    timestamp: '2 hours ago',
  },
  {
    id: 'approval-002',
    document: 'Payment batch · AP-2026-184',
    status: 'warning',
    statusLabel: 'Pending',
    timestamp: '4 hours ago',
  },
  {
    id: 'approval-003',
    document: 'Budget revision · Q2 Marketing',
    status: 'success',
    statusLabel: 'Approved',
    timestamp: '6 hours ago',
  },
  {
    id: 'approval-004',
    document: 'Vendor onboarding · Northstar Ltd',
    status: 'error',
    statusLabel: 'Rejected',
    timestamp: 'Yesterday',
  },
  {
    id: 'approval-005',
    document: 'Travel exception · Sales leadership',
    status: 'info',
    statusLabel: 'In review',
    timestamp: 'Yesterday',
  },
]
