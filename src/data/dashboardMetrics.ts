import { Briefcase, CreditCard, Archive, DollarSign } from 'lucide-react'
import type { DashboardMetric } from '../types/dashboard'

export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: 'cash-position',
    title: 'Cash Position',
    value: '$29.3M',
    change: '+4.8%',
    changeType: 'increase',
    subtitle: 'vs previous week',
    icon: CreditCard,
  },
  {
    id: 'collections-today',
    title: 'Collections Today',
    value: '$1.4M',
    change: '+12.2%',
    changeType: 'increase',
    subtitle: 'vs yesterday',
    icon: Archive,
  },
  {
    id: 'receivables',
    title: 'Receivables',
    value: '$8.2M',
    change: '-2.1%',
    changeType: 'decrease',
    subtitle: 'vs previous week',
    icon: DollarSign,
  },
  {
    id: 'project-sales',
    title: 'Project Sales',
    value: '$5.7M',
    change: '+9.5%',
    changeType: 'increase',
    subtitle: 'vs previous week',
    icon: Briefcase,
  },
]
