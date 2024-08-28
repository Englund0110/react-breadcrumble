import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { replacePathParams, useBreadcrumbs } from "react-breadcrumble";

export const Breadcrumbs = () => {
  const router = useRouterState();
  const { setBreadcrumbs, useBreadcrumbTrail } = useBreadcrumbs();

  const trail = useBreadcrumbTrail(router.location.pathname);

  // Set initial breadcrumbs.
  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "About", path: "/about", parent: "/" },
      { label: "Users", path: "/users", parent: "/" },
      { label: "User", path: "/users/{id}", parent: "/users" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <ul className="breadcrumb">
      {trail.map((breadcrumb, index) => (
        <li key={index}>
          <Link to={replacePathParams(breadcrumb.path, breadcrumb.params)}>
            {breadcrumb.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
