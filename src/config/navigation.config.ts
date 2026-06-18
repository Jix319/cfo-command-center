/**
 * Navigation configuration
 * Central source of truth for all menu items and routes
 */

import type { NavItem } from '../types/navigation';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
  },
  {
    id: 'treasury',
    label: 'Treasury',
    path: '/treasury',
    icon: 'PiggyBank',
  },
  {
    id: 'sales',
    label: 'Sales',
    path: '/sales',
    icon: 'TrendingUp',
  },
  {
    id: 'collections',
    label: 'Collections',
    path: '/collections',
    icon: 'ReceiptText',
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Briefcase',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    path: '/compliance',
    icon: 'ClipboardList',
  },
  {
    id: 'upload',
    label: 'Upload',
    path: '/upload',
    icon: 'Upload',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'FileText',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
  },
];

/**
 * Route to nav item mapping for quick lookup
 */
export const ROUTE_TO_NAV_ITEM = NAV_ITEMS.reduce(
  (acc, item) => {
    acc[item.path] = item;
    return acc;
  },
  {} as Record<string, NavItem>
);
