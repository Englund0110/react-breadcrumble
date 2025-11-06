import { type Breadcrumb } from "./types";

/**
 * Method to match a breadcrumb by path, supporting dynamic segments and wildcards.
 * @param path The path to match
 * @param definitions The list of breadcrumb definitions
 * @returns The matched Breadcrumb or undefined
 */
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

/**
 * Method to build the breadcrumb trail for a given path.
 * @param currentPath The current path
 * @param definitions The list of breadcrumb definitions
 * @param trail The accumulated breadcrumb trail
 * @returns Array of Breadcrumbs representing the trail
 */
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

/**
 * Method to replace path parameters with actual values.
 * @param path The path with parameters
 * @param params The parameters to replace
 * @returns The path with parameters replaced
 */
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
