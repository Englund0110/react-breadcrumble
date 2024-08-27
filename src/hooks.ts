import { useContext, useMemo } from "react";
import { BreadcrumbContext } from "./BreadcrumbContext";
import { buildBreadcrumbTrail } from "./utils";
import { Breadcrumb } from "./types";

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};

export const useBreadcrumbTrail = (currentPath: string): Breadcrumb[] => {
  const { breadcrumbs } = useBreadcrumbs();

  return useMemo(() => {
    return buildBreadcrumbTrail(currentPath, breadcrumbs);
  }, [breadcrumbs, currentPath]);
};
