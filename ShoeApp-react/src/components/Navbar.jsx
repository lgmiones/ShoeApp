import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const active = ({ isActive }) =>
    isActive ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          ShoeShop
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
