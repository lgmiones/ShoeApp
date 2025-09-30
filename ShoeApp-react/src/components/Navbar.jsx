// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import { ShoeIcon, CartIcon, OrderIcon } from "./art/Icons";

function CartWithBadge({ children, count = 0 }) {
  return (
    <span className="relative inline-flex items-center">
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[10px] leading-[18px] text-center px-[4px]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

export default function Navbar() {
  const { isAuthed, email, logout } = useAuth();
  const cartCtx = useCart();
  const count = cartCtx?.count ?? 0; // ← use the cart context safely

  const base =
    "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-colors " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60";
  const idle = "text-gray-700 hover:text-blue-700";
  const active =
    "text-blue-700 bg-white shadow border border-white/60 " +
    "after:absolute after:inset-x-3 after:-bottom-[6px] after:h-[3px] after:rounded-full after:bg-blue-500/70";

  const linkClass = ({ isActive }) => `${base} ${isActive ? active : idle}`;

  return (
    <header className="sticky top-0 z-40">
      <div className="h-[1px] w-full bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200/60" />
      <div className="backdrop-blur-md bg-white/70 border-b border-white/40 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            {/* Brand */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-2xl"
              aria-label="zFlipsters home"
            >
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">
                <span className="text-xs font-bold">zF</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-gray-900 group-hover:opacity-90">
                zFlipsters
              </span>
            </Link>

            {/* Desktop nav with icons */}
            <nav className="hidden sm:flex items-center gap-1 rounded-2xl bg-gray-100 p-1">
              <NavLink to="/" className={linkClass} end>
                <ShoeIcon />
                <span>Shoes</span>
              </NavLink>
              <NavLink to="/cart" className={linkClass}>
                <CartWithBadge count={count}>
                  <CartIcon />
                </CartWithBadge>
                <span>Cart</span>
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                <OrderIcon />
                <span>Orders</span>
              </NavLink>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-2">
              {isAuthed ? (
                <>
                  <span className="hidden sm:inline-flex items-center rounded-xl border border-white/60 bg-white px-3 py-1 text-sm text-gray-700 shadow">
                    {email}
                  </span>
                  <button
                    onClick={logout}
                    className="rounded-xl bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-600/90"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="rounded-xl bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-600/90"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile nav with icons */}
          <nav className="sm:hidden pb-3 pt-1">
            <div className="flex gap-2 overflow-x-auto rounded-2xl bg-gray-100 p-1">
              <NavLink to="/" className={linkClass} end>
                <ShoeIcon />
                <span>Shoes</span>
              </NavLink>
              <NavLink to="/cart" className={linkClass}>
                <CartWithBadge count={count}>
                  <CartIcon />
                </CartWithBadge>
                <span>Cart</span>
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                <OrderIcon />
                <span>Orders</span>
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
