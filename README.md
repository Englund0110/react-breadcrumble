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

Wrapping the application with BreadcrumbProvider.

```typescript
// main.tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BreadcrumbProvider>...</BreadcrumbProvider>
  </StrictMode>
);
```

Create a component that dynamically generates the breadcrumb trail based on the current route.

```typescript
// Breadcrumbs.tsx
import { useEffect } from "react";
import { replacePathParams, useBreadcrumbs } from "react-breadcrumble";

export const Breadcrumbs = () => {
  const currentPath = window.location.pathname;
  const { setBreadcrumbs, getBreadcrumbTrail } = useBreadcrumbs();

  const trail = getBreadcrumbTrail(currentPath);

  // Set initial breadcrumbs.
  useEffect(() => {
    setBreadcrumbs([
      { label: "Home", path: "/" },
      { label: "About", path: "/about", parent: "/" },
      { label: "Users", path: "/users", parent: "/" },
      { label: "User", path: "/users/{id}", parent: "/users" },
      { label: "User", path: "/users/{id}/*", parent: "/users/{id}" }, // Use '*' as a wildcard to catch all nested routes under /users/{id}
    ]);
  }, [setBreadcrumbs]);

  return (
    <ul className="breadcrumb">
      {trail.map((breadcrumb, index) => (
        <li key={index}>
          <a href={replacePathParams(breadcrumb.path, breadcrumb.params)}>
            {breadcrumb.label}
          </a>
        </li>
      ))}
    </ul>
  );
};
```

### Update breadcrumb dynamically

To update a breadcrumb label based on external data (e.g., user details), use the `updateBreadcrumb` function. This allows you to modify the breadcrumb trail dynamically.

```typescript
// User.tsx
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
