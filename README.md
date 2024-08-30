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

## Example of usage with TanStack/Router

This guide shows how to integrate breadcrumb navigation into your application using TanStack/Router with react-breadcrumble. You can also use this approach as inspiration for implementing breadcrumbs with other router libraries.

### Simple

Wrapping the application with BreadcrumbProvider.

```typescript
// main.tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BreadcrumbProvider>
      <RouterProvider router={router} />
      ...
    </BreadcrumbProvider>
  </StrictMode>
);
```

Create a component that dynamically generates the breadcrumb trail based on the current route.

```typescript
// Breadcrumbs.tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { replacePathParams, useBreadcrumbs } from "react-breadcrumble";

export const Breadcrumbs = () => {
  const router = useRouterState();
  const { setBreadcrumbs, getBreadcrumbTrail } = useBreadcrumbs();

  const trail = getBreadcrumbTrail(router.location.pathname);

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
```

### Update breadcrumb dynamically

To update a breadcrumb label based on external data (e.g., user details), use the `updateBreadcrumb` function. This allows you to modify the breadcrumb trail dynamically.

#### Example

```typescript
// users_.$userId.tsx
function User() {
  const [user, setUser] = useState<UserModel>();
  const { userId } = Route.useParams();
  const { updateBreadcrumb } = useBreadcrumbs();

  useEffect(() => {
    setUser(users.find((u) => u.id === userId));
  }, [userId]);

  useEffect(() => {
    // Replace {id} with the user identifier, and replace label with the name of the user.
    updateBreadcrumb("/users/{id}", user?.name ?? "", [
      { key: "id", value: user?.id ?? "" },
    ]);

    return () => {
      updateBreadcrumb("/users/{id}", ""); // Reset breadcrumb when leaving component.
    };
  }, [user, updateBreadcrumb]);

  return (
    <>
      <h3>{user?.name}</h3>
      <p>{user?.description}</p>
    </>
  );
}
```
