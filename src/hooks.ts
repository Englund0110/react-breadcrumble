import { useContext } from "react";
import { BreadcrumbContext } from "./BreadcrumbContext";

/**
 * Hook to access breadcrumb context methods and state.
 * @returns
 */
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};
