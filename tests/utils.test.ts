import { expect, test } from "vitest";
import { buildTrail, getBreadcrumbByPath, transformPath } from "../src/utils";
import { Breadcrumb } from "../src/types";

// getBreadcrumbByPath
test("getBreadcrumbByPath finds breadcrumb for given path", () => {
  const breadcrumbs: Breadcrumb[] = [
    { path: "/", label: "Home" },
    { path: "/users", label: "Users" },
    { path: "/users/{id}", label: "User" },
    { path: "/users/{id}/posts", label: "Posts" },
    { path: "/users/{id}/posts/{id}", label: "Post" },
    { path: "/about", label: "About" },
  ];

  expect(getBreadcrumbByPath("/", breadcrumbs)).toStrictEqual({
    path: "/",
    label: "Home",
  });

  expect(getBreadcrumbByPath("/users", breadcrumbs)).toStrictEqual({
    path: "/users",
    label: "Users",
  });

  expect(getBreadcrumbByPath("/users/123", breadcrumbs)).toStrictEqual({
    path: "/users/{id}",
    label: "User",
  });

  expect(getBreadcrumbByPath("/users/123/posts", breadcrumbs)).toStrictEqual({
    path: "/users/{id}/posts",
    label: "Posts",
  });

  expect(
    getBreadcrumbByPath("/users/123/posts/{id}", breadcrumbs)
  ).toStrictEqual({
    path: "/users/{id}/posts/{id}",
    label: "Post",
  });
});

// buildTrail
test("buildTrail returns breadcrumbs for given path", () => {
  const breadcrumbs: Breadcrumb[] = [
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
    { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
    {
      path: "/users/{id}/posts/{id}",
      label: "Post",
      parent: "/users/{id}/posts",
    },
    { path: "/about", label: "About" },
  ];

  expect(buildTrail("/does-not-exist", breadcrumbs)).toStrictEqual([]);

  expect(buildTrail("/", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
  ]);

  expect(buildTrail("/users", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
  ]);

  expect(buildTrail("/users/123", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
  ]);

  expect(buildTrail("/users/123/posts", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
    { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
  ]);

  expect(buildTrail("/users/123/posts/321", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
    { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
    {
      path: "/users/{id}/posts/{id}",
      label: "Post",
      parent: "/users/{id}/posts",
    },
  ]);
});

// transformPath
test("should replace placeholders with corresponding values", () => {
  let breadcrumb: Breadcrumb | undefined = undefined;
  breadcrumb = { path: "/users", label: "Users", parent: "/" };
  expect(transformPath(breadcrumb)).toStrictEqual("/users");

  breadcrumb = {
    path: "/users/{id}",
    label: "User",
    params: [{ key: "ids", value: "123" }], // Incorrect key
    parent: "/users",
  };
  expect(transformPath(breadcrumb)).toStrictEqual("/users/{id}");

  breadcrumb = {
    path: "/users/{id}",
    label: "User",
    params: [{ key: "id", value: "123" }],
    parent: "/users",
  };
  expect(transformPath(breadcrumb)).toStrictEqual("/users/123");

  breadcrumb = {
    path: "/users/{id}/posts",
    label: "Posts",
    params: [{ key: "id", value: "123" }],
    parent: "/users",
  };
  expect(transformPath(breadcrumb)).toStrictEqual("/users/123/posts");

  breadcrumb = {
    path: "/users/{id}/posts/{id}",
    label: "Posts",
    params: [
      { key: "id", value: "123" },
      { key: "id", value: "312" },
    ],
    parent: "/users",
  };
  expect(transformPath(breadcrumb)).toStrictEqual("/users/123/posts/312");
});
