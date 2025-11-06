import { createContext, useCallback, useState } from "react";
import {
  type Breadcrumb,
  type BreadcrumbContextType,
  type BreadcrumbProviderProps,
} from "./types";
import { buildBreadcrumbTrail } from "./utils";

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export const BreadcrumbProvider = ({
  children,
  breadcrumbs: initialBreadcrumbs,
}: BreadcrumbProviderProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(
    initialBreadcrumbs || []
  );

  /**
   * Method to update a breadcrumb's label and parameters.
   */
  const updateBreadcrumb = useCallback(
    (
      path: string,
      newLabel: string,
      params?: { key: string; value: string }[] | undefined
    ) => {
      setBreadcrumbs((prevBreadcrumbs) =>
        prevBreadcrumbs.map(
          (b): Breadcrumb =>
            b.path === path ? { ...b, label: newLabel, params } : b
        )
      );
    },
    [setBreadcrumbs]
  );

  /**
   * Method to reset a breadcrumb to its initial state.
   */
  const resetBreadcrumb = useCallback(
    (path: string) => {
      const initialBreadcrumb = initialBreadcrumbs?.find(
        (b) => b.path === path
      );
      if (initialBreadcrumb) {
        setBreadcrumbs((prevBreadcrumbs) =>
          prevBreadcrumbs.map((b) => (b.path === path ? initialBreadcrumb : b))
        );
      }
    },
    [setBreadcrumbs]
  );

  /**
   * Method to get the breadcrumb trail for a given path.
   */
  const getBreadcrumbTrail = useCallback(
    (currentPath: string) => {
      return buildBreadcrumbTrail(currentPath, breadcrumbs);
    },
    [buildBreadcrumbTrail, breadcrumbs]
  );

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        updateBreadcrumb,
        resetBreadcrumb,
        getBreadcrumbTrail,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
