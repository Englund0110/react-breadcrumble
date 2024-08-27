import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { useBreadcrumbs } from "react-breadcrumble";
import { Navbar } from "../components/Navbar";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { setBreadcrumbs } = useBreadcrumbs();

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
    <>
      <Navbar />
      <Breadcrumbs />
      <div className="content">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
