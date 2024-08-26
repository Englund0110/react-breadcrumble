import { Link, useRouterState } from "@tanstack/react-router";
import { useBreadcrumbTrail, transformPath } from "react-breadcrumble";

export const Breadcrumbs = () => {
  const router = useRouterState();
  const trail = useBreadcrumbTrail(router.location.pathname);

  return (
    <ul className="breadcrumb">
      {trail.map((breadcrumb, index) => (
        <li key={index}>
          <Link to={transformPath(breadcrumb)}>{breadcrumb.label}</Link>
        </li>
      ))}
    </ul>
  );
};
