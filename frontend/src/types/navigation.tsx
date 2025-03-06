export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  requiresAuth: boolean;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  path: string;
  label: string;
}
