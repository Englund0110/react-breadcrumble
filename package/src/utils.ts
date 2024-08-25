import { Breadcrumb } from "./types";

export const getBreadcrumbByPath = (
  path: string,
  definitions: Breadcrumb[]
): Breadcrumb | undefined => {
  return definitions.find((breadcrumb) => {
    // Match breadcrumb path with the given path considering dynamic segments.
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

/**
 * Transforms a path template by replacing placeholders with corresponding values.
 *
 * @param breadcrumb - An object containing the path template and an optional array of key-value pairs.
 *   - `path`: A string representing the path with placeholders in the form of `{key}`.
 *   - `params`: An optional array of objects, each containing a `key` and a `value`. The `key` corresponds to a placeholder in the path, and `value` is the string that will replace that placeholder.
 *
 * @returns A string where all placeholders in the path have been replaced with their corresponding values from `params`.
 *
 * @example
 * const breadcrumb = {
 *   path: '/users/{id}/details',
 *   params: [
 *     { key: 'id', value: '1234' }
 *   ]
 * };
 *
 * const result = transformPath(breadcrumb);
 * console.log(result); // Output: '/users/1234/details'
 */
export const transformPath = (breadcrumb: Breadcrumb) => {
  let transformedPath = breadcrumb.path;

  breadcrumb.params?.forEach((p) => {
    transformedPath = transformedPath.replace(`{${p.key}}`, p.value);
  });

  return transformedPath;
};
