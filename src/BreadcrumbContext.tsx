import React, { createContext, useCallback, useState } from "react";
import { Breadcrumb } from "./types";

type BreadcrumbContextType = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>;
  updateBreadcrumb: (
    path: string,
    newLabel: string,
    params?: { key: string; value: string }[]
  ) => void;
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

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, setBreadcrumbs, updateBreadcrumb }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
