import { expect, test, describe } from "vitest";
import {
  buildBreadcrumbTrail,
  matchBreadcrumbByPath,
  replacePathParams,
} from "../src/utils";
import { Breadcrumb } from "../src/types";

// Shared breadcrumbs data
const breadcrumbs: Breadcrumb[] = [
  { path: "/", label: "Home" },
  { path: "/users", label: "Users" },
  { path: "/users/{id}", label: "User" },
  { path: "/users/{id}/posts", label: "Posts" },
  { path: "/users/{id}/posts/{id}", label: "Post" },
  { path: "/users/{id}/posts/{id}/*", label: "Post" },
  { path: "/users/{id}/posts/{id}/*/comments", label: "Comments" },
  { path: "/users/{id}/posts/{id}/*/likes/*", label: "Likes" },
  { path: "/about", label: "About" },
];

const breadcrumbsWithParents: Breadcrumb[] = [
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

// Tests
describe("matchBreadcrumbByPath", () => {
  test.each([
    ["/", { path: "/", label: "Home" }],
    ["/users", { path: "/users", label: "Users" }],
    ["/users/123", { path: "/users/{id}", label: "User" }],
    ["/users/123/posts", { path: "/users/{id}/posts", label: "Posts" }],
    [
      "/users/123/posts/{id}",
      { path: "/users/{id}/posts/{id}", label: "Post" },
    ],
    [
      "/users/123/posts/{id}/wildcard",
      { path: "/users/{id}/posts/{id}/*", label: "Post" },
    ],
    [
      "/users/123/posts/{id}/wildcard/comments",
      { path: "/users/{id}/posts/{id}/*/comments", label: "Comments" },
    ],
    [
      "/users/123/posts/{id}/wildcard/likes/anotherwildcard",
      { path: "/users/{id}/posts/{id}/*/likes/*", label: "Likes" },
    ],
  ])("finds breadcrumb for path %s", (path, expected) => {
    expect(matchBreadcrumbByPath(path, breadcrumbs)).toStrictEqual(expected);
  });
});

describe("buildBreadcrumbTrail", () => {
  test.each([
    ["/does-not-exist", []],
    ["/", [{ path: "/", label: "Home" }]],
    [
      "/users",
      [
        { path: "/", label: "Home" },
        { path: "/users", label: "Users", parent: "/" },
      ],
    ],
    [
      "/users/123",
      [
        { path: "/", label: "Home" },
        { path: "/users", label: "Users", parent: "/" },
        { path: "/users/{id}", label: "User", parent: "/users" },
      ],
    ],
    [
      "/users/123/posts",
      [
        { path: "/", label: "Home" },
        { path: "/users", label: "Users", parent: "/" },
        { path: "/users/{id}", label: "User", parent: "/users" },
        { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
      ],
    ],
    [
      "/users/123/posts/321",
      [
        { path: "/", label: "Home" },
        { path: "/users", label: "Users", parent: "/" },
        { path: "/users/{id}", label: "User", parent: "/users" },
        { path: "/users/{id}/posts", label: "Posts", parent: "/users/{id}" },
        {
          path: "/users/{id}/posts/{id}",
          label: "Post",
          parent: "/users/{id}/posts",
        },
      ],
    ],
    [
      "/users/123/posts/321/wildcard",
      [
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
      ],
    ],
    [
      "/users/123/posts/321/wildcard/comments",
      [
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
      ],
    ],
  ])("returns breadcrumb trail for path %s", (path, expected) => {
    expect(buildBreadcrumbTrail(path, breadcrumbsWithParents)).toStrictEqual(
      expected
    );
  });
});

describe("replacePathParams", () => {
  test.each([
    [{ path: "/users", label: "Users", parent: "/" }, [], "/users"],
    [
      {
        path: "/users/{id}",
        label: "User",
        parent: "/users",
        params: [{ key: "ids", value: "123" }],
      },
      [{ key: "ids", value: "123" }],
      "/users/{id}",
    ],
    [
      {
        path: "/users/{id}",
        label: "User",
        parent: "/users",
        params: [{ key: "id", value: "123" }],
      },
      [{ key: "id", value: "123" }],
      "/users/123",
    ],
    [
      {
        path: "/users/{id}/posts",
        label: "Posts",
        parent: "/users",
        params: [{ key: "id", value: "123" }],
      },
      [{ key: "id", value: "123" }],
      "/users/123/posts",
    ],
    [
      {
        path: "/users/{id}/posts/{id}",
        label: "Posts",
        parent: "/users",
        params: [
          { key: "id", value: "123" },
          { key: "id", value: "312" },
        ],
      },
      [
        { key: "id", value: "123" },
        { key: "id", value: "312" },
      ],
      "/users/123/posts/312",
    ],
  ])(
    "replaces placeholders in path %s with params %s",
    (breadcrumb, params, expected) => {
      expect(replacePathParams(breadcrumb.path, params)).toStrictEqual(
        expected
      );
    }
  );
});
