/**
 * Type representing a single breadcrumb.
 */
export interface Breadcrumb {
  label: string;
  path: string;
  params?: { key: string; value: string }[] | undefined;
  parent?: string | undefined;
}

/**
 * Type for the Breadcrumb Context.
 */
export interface BreadcrumbContextType {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
  updateBreadcrumb: (
    path: string,
    newLabel: string,
    params?: { key: string; value: string }[]
  ) => void;
  resetBreadcrumb: (path: string) => void;
  getBreadcrumbTrail: (currentPath: string) => Breadcrumb[];
}

/**
 * Props for the BreadcrumbProvider component.
 */
export interface BreadcrumbProviderProps {
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
}
