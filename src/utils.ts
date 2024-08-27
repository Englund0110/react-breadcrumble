import { Breadcrumb } from "./types";

export const getBreadcrumbByPath = (
  path: string,
  definitions: Breadcrumb[]
): Breadcrumb | undefined => {
  return definitions.find((breadcrumb) => {
    const breadcrumbPath = breadcrumb.path.replace(/{[^/]+}/g, "([^/]+)");
    const regex = new RegExp(`^${breadcrumbPath}$`);
    return regex.test(path);
  });
};

export const buildTrail = (
  currentPath: string,
  definitions: Breadcrumb[],
  trail: Breadcrumb[] = []
): Breadcrumb[] => {
  const currentBreadcrumb = getBreadcrumbByPath(currentPath, definitions);

  if (!currentBreadcrumb) {
    return trail;
  }

  trail.unshift(currentBreadcrumb);

  if (currentBreadcrumb.parent) {
    return buildTrail(currentBreadcrumb.parent, definitions, trail);
  }

  return trail;
};

export const transformPath = (breadcrumb: Breadcrumb) => {
  let transformedPath = breadcrumb.path;

  breadcrumb.params?.forEach((p) => {
    transformedPath = transformedPath.replace(`{${p.key}}`, p.value);
  });

  return transformedPath;
};
