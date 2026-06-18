/**
 * Icon Mapper Utility
 * Maps icon names to Lucide React icon components
 * Centralizes icon imports for easy maintenance
 */

import {
  LayoutDashboard,
  PiggyBank,
  TrendingUp,
  ReceiptText,
  Briefcase,
  ClipboardList,
  Upload,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  PiggyBank,
  TrendingUp,
  ReceiptText,
  Briefcase,
  ClipboardList,
  Upload,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
};

export function getIcon(iconName: string): LucideIcon | null {
  return ICON_MAP[iconName] ?? null;
}

export function renderIcon(
  iconName: string,
  className: string = 'w-5 h-5'
): JSX.Element | null {
  const Icon = getIcon(iconName);
  if (!Icon) return null;
  return <Icon className={className} />;
}
