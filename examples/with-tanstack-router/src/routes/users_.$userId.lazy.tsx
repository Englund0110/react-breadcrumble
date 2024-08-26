import { createLazyFileRoute } from "@tanstack/react-router";
import { users, UserModel } from "../data/users";
import { useEffect, useState } from "react";
import { useBreadcrumbs } from "react-breadcrumble";
export const Route = createLazyFileRoute("/users/$userId")({
  component: User,
});

function User() {
  const [user, setUser] = useState<UserModel>();
  const { userId } = Route.useParams();
  const { updateBreadcrumb } = useBreadcrumbs();

  useEffect(() => {
    setUser(users.find((u) => u.id === userId));
  }, [user, users]);

  useEffect(() => {
    updateBreadcrumb("/users/{id}", user?.name ?? "", [
      { key: "id", value: user?.id ?? "" },
    ]);

    return () => {
      updateBreadcrumb("/users/{id}", "");
    };
  }, [user]);

  return (
    <>
      <h3>{user?.name}</h3>
      <p>{user?.description}</p>
    </>
  );
}
