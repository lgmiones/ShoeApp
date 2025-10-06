import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

// The main App component serves as the root layout for the entire application
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar appears at the top of every page */}
      <Navbar />

      {/* Main content area — Outlet renders whatever route (page) is currently active */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      {/* Footer section displayed at the bottom of all pages */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        Happy shopping, Enjoy every shoes.
      </footer>
    </div>
  );
}
// The App component sets up the overall layout with a navbar, main content area, and footer.
// The Outlet component from react-router-dom is used to render the active page based on the current route.
