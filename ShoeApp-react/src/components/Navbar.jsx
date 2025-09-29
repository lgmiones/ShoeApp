import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkBase =
    "relative text-gray-700 transition-colors duration-200 ease-out " +
    // underline rail
    "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 " +
    "after:h-[2px] after:w-0 after:bg-blue-600 after:rounded-full " +
    "after:transition-all after:duration-300 after:ease-out " +
    // motion-safe avoids animating for reduced-motion users
    "motion-safe:transition motion-safe:will-change-transform";

  const linkHover =
    "hover:text-blue-600 hover:after:w-3/4 hover:-translate-y-[1px]";

  const linkActive = "text-blue-500 font-semibold after:w-3/4";

  const active = ({ isActive }) =>
    `${linkBase} ${linkHover} ${isActive ? linkActive : ""}`;

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight transition-transform motion-safe:hover:scale-[1.01]"
        >
          zFlipsters
        </Link>

        <nav className="flex gap-6 text-sm">
          <NavLink to="/" className={active}>
            Shoes
          </NavLink>
          <NavLink to="/cart" className={active}>
            Cart
          </NavLink>
          <NavLink to="/orders" className={active}>
            Orders
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
