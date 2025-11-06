export type Breadcrumb = {
  label: string;
  path: string;
  params?: { key: string; value: string }[] | undefined;
  parent?: string | undefined;
};

export type BreadcrumbContextType = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
  updateBreadcrumb: (
    path: string,
    newLabel: string,
    params?: { key: string; value: string }[]
  ) => void;
  resetBreadcrumb: (path: string) => void;
  getBreadcrumbTrail: (currentPath: string) => Breadcrumb[];
};

export type BreadcrumbProviderProps = {
  initialBreadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
};
