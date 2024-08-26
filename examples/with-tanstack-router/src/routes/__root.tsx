import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  buildTrail,
  transformPath,
  useBreadcrumbs,
} from "react-breadcrumble";
import { Navbar } from "../components/Navbar";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const router = useRouterState();
  const { setBreadcrumbs, breadcrumbs } = useBreadcrumbs();
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "About", path: "/about", parent: "/" },
      { label: "Users", path: "/users", parent: "/" },
      { label: "User", path: "/users/{id}", parent: "/users" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    setBreadcrumbTrail(buildTrail(router.location.pathname, breadcrumbs));
  }, [breadcrumbs, router.location.pathname]);

  return (
    <>
      <Navbar />
      <ul className="breadcrumb">
        {breadcrumbTrail.map((breadcrumb, index) => (
          <li key={index}>
            <Link to={transformPath(breadcrumb)}>{breadcrumb.label}</Link>
          </li>
        ))}
      </ul>
      <div className="content">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
