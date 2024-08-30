import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "../components/Navbar";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
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
