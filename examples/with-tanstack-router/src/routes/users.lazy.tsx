import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { users } from "../data/users";

export const Route = createLazyFileRoute("/users")({
  component: Users,
});

function Users() {
  return (
    <div>
      <ul>
        {users?.map((u) => {
          return (
            <li key={u.id}>
              <Link to="/users/$userId" params={{ userId: u.id }}>
                {u.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
