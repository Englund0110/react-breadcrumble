export type Breadcrumb = {
  label: string;
  path: string;
  params?: { key: string; value: string }[];
  parent?: string;
};
