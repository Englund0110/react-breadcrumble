import { expect, test } from "vitest";
import {
  buildBreadcrumbTrail,
  matchBreadcrumbByPath,
  replacePathParams,
} from "../src/utils";
import { Breadcrumb } from "../src/types";

// matchBreadcrumbByPath
test("getBreadcrumbByPath finds breadcrumb for given path", () => {
  const breadcrumbs: Breadcrumb[] = [
    { path: "/", label: "Home" },
    { path: "/users", label: "Users" },
    { path: "/users/{id}", label: "User" },
    { path: "/users/{id}/posts", label: "Posts" },
    { path: "/users/{id}/posts/{id}", label: "Post" },
    { path: "/users/{id}/posts/{id}/*", label: "Post" },
    { path: "/users/{id}/posts/{id}/*/comments", label: "Comments" },
    { path: "/users/{id}/posts/{id}/*/likes", label: "Likes" },
    { path: "/about", label: "About" },
  ];

  expect(matchBreadcrumbByPath("/", breadcrumbs)).toStrictEqual({
    path: "/",
    label: "Home",
  });

  expect(matchBreadcrumbByPath("/users", breadcrumbs)).toStrictEqual({
    path: "/users",
    label: "Users",
  });

  expect(matchBreadcrumbByPath("/users/123", breadcrumbs)).toStrictEqual({
    path: "/users/{id}",
    label: "User",
  });

  expect(matchBreadcrumbByPath("/users/123/posts", breadcrumbs)).toStrictEqual({
    path: "/users/{id}/posts",
    label: "Posts",
  });

  expect(
    matchBreadcrumbByPath("/users/123/posts/{id}", breadcrumbs)
  ).toStrictEqual({
    path: "/users/{id}/posts/{id}",
    label: "Post",
  });

  expect(
    matchBreadcrumbByPath("/users/123/posts/{id}/wildcard", breadcrumbs)
  ).toStrictEqual({
    path: "/users/{id}/posts/{id}/*",
    label: "Post",
  });

  expect(
    matchBreadcrumbByPath(
      "/users/123/posts/{id}/wildcard/comments",
      breadcrumbs
    )
  ).toStrictEqual({
    path: "/users/{id}/posts/{id}/*/comments",
    label: "Comments",
  });

  expect(
    matchBreadcrumbByPath("/users/123/posts/{id}/wildcard/likes", breadcrumbs)
  ).toStrictEqual({
    path: "/users/{id}/posts/{id}/*/likes",
    label: "Likes",
  });
});

// buildBreadcrumbTrail
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
    {
      path: "/users/{id}/posts/{id}/*",
      label: "Post",
      parent: "/users/{id}/posts/{id}",
    },
    {
      path: "/users/{id}/posts/{id}/*/comments",
      label: "Comments",
      parent: "/users/{id}/posts/{id}/*",
    },
    { path: "/about", label: "About" },
  ];

  expect(buildBreadcrumbTrail("/does-not-exist", breadcrumbs)).toStrictEqual(
    []
  );

  expect(buildBreadcrumbTrail("/", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
  ]);

  expect(buildBreadcrumbTrail("/users", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
  ]);

  expect(buildBreadcrumbTrail("/users/123", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
  ]);

  expect(buildBreadcrumbTrail("/users/123/posts", breadcrumbs)).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
    { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
  ]);

  expect(
    buildBreadcrumbTrail("/users/123/posts/321", breadcrumbs)
  ).toStrictEqual([
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

  expect(
    buildBreadcrumbTrail("/users/123/posts/321/wildcard", breadcrumbs)
  ).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
    { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
    {
      path: "/users/{id}/posts/{id}",
      label: "Post",
      parent: "/users/{id}/posts",
    },
    {
      path: "/users/{id}/posts/{id}/*",
      label: "Post",
      parent: "/users/{id}/posts/{id}",
    },
  ]);

  expect(
    buildBreadcrumbTrail("/users/123/posts/321/wildcard/comments", breadcrumbs)
  ).toStrictEqual([
    { path: "/", label: "Home" },
    { path: "/users", label: "Users", parent: "/" },
    { path: "/users/{id}", label: "User", parent: "/users" },
    { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
    {
      path: "/users/{id}/posts/{id}",
      label: "Post",
      parent: "/users/{id}/posts",
    },
    {
      path: "/users/{id}/posts/{id}/*",
      label: "Post",
      parent: "/users/{id}/posts/{id}",
    },
    {
      path: "/users/{id}/posts/{id}/*/comments",
      label: "Comments",
      parent: "/users/{id}/posts/{id}/*",
    },
  ]);
});

// transformPath
test("should replace placeholders with corresponding values", () => {
  let breadcrumb: Breadcrumb | undefined = undefined;
  breadcrumb = { path: "/users", label: "Users", parent: "/" };
  expect(replacePathParams(breadcrumb.path, breadcrumb.params)).toStrictEqual(
    "/users"
  );

  breadcrumb = {
    path: "/users/{id}",
    label: "User",
    params: [{ key: "ids", value: "123" }], // Incorrect key
    parent: "/users",
  };
  expect(replacePathParams(breadcrumb.path, breadcrumb.params)).toStrictEqual(
    "/users/{id}"
  );

  breadcrumb = {
    path: "/users/{id}",
    label: "User",
    params: [{ key: "id", value: "123" }],
    parent: "/users",
  };
  expect(replacePathParams(breadcrumb.path, breadcrumb.params)).toStrictEqual(
    "/users/123"
  );

  breadcrumb = {
    path: "/users/{id}/posts",
    label: "Posts",
    params: [{ key: "id", value: "123" }],
    parent: "/users",
  };
  expect(replacePathParams(breadcrumb.path, breadcrumb.params)).toStrictEqual(
    "/users/123/posts"
  );

  breadcrumb = {
    path: "/users/{id}/posts/{id}",
    label: "Posts",
    params: [
      { key: "id", value: "123" },
      { key: "id", value: "312" },
    ],
    parent: "/users",
  };
  expect(replacePathParams(breadcrumb.path, breadcrumb.params)).toStrictEqual(
    "/users/123/posts/312"
  );
});
