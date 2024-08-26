import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "./BreadcrumbContext";
import { buildTrail } from "./utils";
import { Breadcrumb } from "./types";

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};

export const useBreadcrumbTrail = (currentPath: string) => {
  const { breadcrumbs } = useBreadcrumbs();
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    setBreadcrumbTrail(buildTrail(currentPath, breadcrumbs));
  }, [breadcrumbs, currentPath]);

  return breadcrumbTrail;
};
