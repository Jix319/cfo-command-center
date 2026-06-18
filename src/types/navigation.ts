/**
 * Navigation types for sidebar and routing
 * Defines menu items, routes, and navigation structure
 */

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string; // Lucide icon name
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface LayoutState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
}
