import type { ComponentType } from 'react'
import { Archive, BarChart2, Briefcase, CreditCard, DollarSign, Home, ShieldCheck, Settings, Upload } from 'lucide-react'

export interface RouteDefinition {
  path: string
  label: string
  icon: ComponentType<React.SVGProps<SVGSVGElement>>
  breadcrumb: string[]
}

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  { path: '/', label: 'Dashboard', icon: Home, breadcrumb: ['Dashboard', 'Home'] },
  { path: '/projects', label: 'Projects', icon: Briefcase, breadcrumb: ['Dashboard', 'Projects'] },
  { path: '/sales', label: 'Sales', icon: DollarSign, breadcrumb: ['Dashboard', 'Sales'] },
  { path: '/collections', label: 'Collections', icon: Archive, breadcrumb: ['Dashboard', 'Collections'] },
  { path: '/treasury', label: 'Treasury', icon: CreditCard, breadcrumb: ['Dashboard', 'Treasury'] },
  { path: '/compliance', label: 'Compliance', icon: ShieldCheck, breadcrumb: ['Dashboard', 'Compliance'] },
  { path: '/reports', label: 'Reports', icon: BarChart2, breadcrumb: ['Dashboard', 'Reports'] },
  { path: '/upload', label: 'Upload', icon: Upload, breadcrumb: ['Dashboard', 'Upload'] },
  { path: '/settings', label: 'Settings', icon: Settings, breadcrumb: ['Dashboard', 'Settings'] },
]

export const NAV_ITEMS = ROUTE_DEFINITIONS
