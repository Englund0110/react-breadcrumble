# react-breadcrumble

Library for building beautiful breadcrumbs in React.

## Overview

`react-breadcrumble` is a React library that allows you to easily manage and display breadcrumbs in your application. The library provides a context-based approach to manage breadcrumbs, making it flexible and easy to integrate into your projects.

## Features

- **Context API**: Manage breadcrumbs using React's Context API.
- **Customizable**: Easily update breadcrumb labels dynamically.
- **Recursive Breadcrumb Trail**: Build breadcrumb trails based on a hierarchical structure.
- **TypeScript Support**: Fully typed with TypeScript for a robust development experience.

## Installation

`npm install react-breadcrumble`

## Example of usage

### Simple

Wrap your main application with BreadcrumbProvider:

```typescript
<BreadcrumbProvider>
  <App />
  ...
</BreadcrumbProvider>
```

Inside your root component, use setBreadcrumbs to define breadcrumb paths:

```typescript
useEffect(() => {
  setBreadcrumbs([
    { label: "Home", path: "/" },
    { label: "Users", path: "/users", parent: "/" },
    { label: "User", path: "/users/{id}", parent: "/users" },
  ]);
}, []);
```

Build your own Breadcrumb component and use the hooks and utilities:

```typescript
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  buildTrail,
  useBreadcrumbs,
  transformPath,
} from "react-breadcrumble-context";

const Breadcrumbs: React.FC = () => {
  const { breadcrumbs } = useBreadcrumbs();
  const [trail, setTrail] = useState<Breadcrumb[]>([]);

  const path = "/users/1234"; // Get the current path from your router-libary.

  useEffect(() => {
    setTrail(buildTrail(path, breadcrumbs));
  }, [breadcrumbs]);

  return (
    <ul className="breadcrumb">
      {trail.map((breadcrumb, index) => (
        <li key={index}>
          {index < trail.length - 1 ? (
            <a href={transformPath(breadcrumb)}>{breadcrumb.label}</a>
          ) : (
            <span>{breadcrumb.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;
```

![example 1](example1.png)
