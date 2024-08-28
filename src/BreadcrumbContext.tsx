import React, { createContext, useCallback, useMemo, useState } from "react";
import { Breadcrumb } from "./types";
import { buildBreadcrumbTrail } from "./utils";

type BreadcrumbContextType = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
  updateBreadcrumb: (
    path: string,
    newLabel: string,
    params?: { key: string; value: string }[]
  ) => void;
  getBreadcrumbTrail: (currentPath: string) => Breadcrumb[];
};

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const updateBreadcrumb = useCallback(
    (
      path: string,
      newLabel: string,
      params?: { key: string; value: string }[]
    ) => {
      setBreadcrumbs((prevBreadcrumbs) =>
        prevBreadcrumbs.map((b) =>
          b.path === path ? { ...b, label: newLabel, params } : b
        )
      );
    },
    [setBreadcrumbs]
  );

  const getBreadcrumbTrail = (currentPath: string): Breadcrumb[] => {
    return useMemo(() => {
      return buildBreadcrumbTrail(currentPath, breadcrumbs);
    }, [breadcrumbs, currentPath]);
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        updateBreadcrumb,
        getBreadcrumbTrail,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
