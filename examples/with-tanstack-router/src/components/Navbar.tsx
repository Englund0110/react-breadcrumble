import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  return (
    <div className="p-2 flex gap-2 navbar">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/users" className="[&.active]:font-bold">
        Users
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
  );
};
