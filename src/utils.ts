import { Breadcrumb } from "./types";

export const matchBreadcrumbByPath = (
  path: string,
  definitions: Breadcrumb[]
): Breadcrumb | undefined => {
  return definitions.find((breadcrumb) => {
    let breadcrumbPath = breadcrumb.path.replace(/{[^/]+}/g, "([^/]+)");
    breadcrumbPath = breadcrumbPath.replace(/\*/g, "([^/]+)");

    const regex = new RegExp(`^${breadcrumbPath}$`);
    return regex.test(path);
  });
};

export const buildBreadcrumbTrail = (
  currentPath: string,
  definitions: Breadcrumb[],
  trail: Breadcrumb[] = []
): Breadcrumb[] => {
  const currentBreadcrumb = matchBreadcrumbByPath(currentPath, definitions);

  if (!currentBreadcrumb) {
    return trail;
  }

  trail.unshift(currentBreadcrumb);

  if (currentBreadcrumb.parent) {
    const parentBreadcrumb = matchBreadcrumbByPath(
      currentBreadcrumb.parent,
      definitions
    );
    if (parentBreadcrumb) {
      return buildBreadcrumbTrail(parentBreadcrumb.path, definitions, trail);
    }
  }

  return trail;
};

export const replacePathParams = (
  path: string,
  params?: { key: string; value: string }[]
): string => {
  if (!params) return path;

  return params.reduce(
    (transformedPath, param) =>
      transformedPath.replace(`{${param.key}}`, param.value),
    path
  );
};
