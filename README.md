# react-breadcrumble

A flexible and easy-to-use library for managing breadcrumbs in React applications.

## Overview

`react-breadcrumble` is a React library that allows you to easily manage and display breadcrumbs in your application. The library provides a context-based approach to manage breadcrumbs, making it flexible and easy to integrate into your projects.

## Features

- **Context API**: Manage breadcrumbs using React's Context API.
- **Customizable**: Easily update breadcrumb labels dynamically.
- **Recursive Breadcrumb Trail**: Build breadcrumb trails based on a hierarchical structure.
- **TypeScript Support**: Fully typed with TypeScript for a robust development experience.

## Installation

`npm install react-breadcrumble`

## Examples

See the following StackBlitz examples for full implementation:

[With React Router v6.2](https://stackblitz.com/edit/vitejs-vite-grxaz2?file=src%2Fcomponents%2FBreadcrumbs.tsx)

[With TanStack/Router](https://stackblitz.com/edit/vitejs-vite-t4wgva?file=src%2Fcomponents%2FBreadcrumbs.tsx)

### Simple implementation

Wrap the application with BreadcrumbProvider and pass in the list of breadcrumb definitions.

```typescript
// main.tsx
const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about", parent: "/" },
  { label: "Users", path: "/users", parent: "/" },
  { label: "User", path: "/users/{id}", parent: "/users" },
  { label: "Resume", path: "/users/{id}/resume", parent: "/users/{id}" },
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BreadcrumbProvider breadcrumbs={breadcrumbs}>
      <RouterProvider router={router} />
    </BreadcrumbProvider>
  </StrictMode>
);
```

Create a component that dynamically generates the breadcrumb trail based on the current route.

```typescript
// Breadcrumbs.tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { replacePathParams, useBreadcrumbs } from "react-breadcrumble";

export const Breadcrumbs = () => {
  const router = useRouterState();
  const { getBreadcrumbTrail } = useBreadcrumbs();

  const trail = getBreadcrumbTrail(router.location.pathname);

  return (
    <ul className="breadcrumb">
      {trail.map((breadcrumb, index) => (
        <li key={index}>
          {trail.length === index + 1 ? (
            breadcrumb.label
          ) : (
            <Link to={replacePathParams(breadcrumb.path, breadcrumb.params)}>
              {breadcrumb.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};
```

### Update breadcrumb dynamically

To update a breadcrumb label based on external data (e.g., user details), use the `updateBreadcrumb` function. This allows you to modify the breadcrumb trail dynamically. Use `resetBreadcrumb` to reset the value back to its initial state.

```typescript
// User.tsx
function User() {
  const { userId } = Route.useParams();
  const { updateBreadcrumb, resetBreadcrumb } = useBreadcrumbs();

  const user = users.find((u) => u.id === userId);

  useEffect(() => {
    // Replace {id} with the user identifier, and replace label with the name of the user.
    updateBreadcrumb("/users/{id}", user?.name ?? "", [
      { key: "id", value: user?.id ?? "" },
    ]);

    return () => {
      resetBreadcrumb("/users/{id}");
    };
  }, [user, updateBreadcrumb, resetBreadcrumb]);

  return (
    <>
      <h3>{user?.name}</h3>
      <p>{user?.description}</p>
    </>
  );
}
```
