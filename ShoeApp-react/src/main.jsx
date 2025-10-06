// Import core React and ReactDOM libraries
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

// Import main components and pages
import App from "./App";
import ShoesPage from "./pages/ShoesPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Import context providers for authentication and cart state
import { AuthProvider } from "./state/AuthContext";
import { CartProvider } from "./state/CartContext";

// ---------------- MAIN APP ENTRY POINT ----------------

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ChakraProvider wraps the entire app to provide Chakra UI styling system */}
    <ChakraProvider value={defaultSystem}>
      {/* AuthProvider provides user authentication data (like login state, roles) */}
      <AuthProvider>
        {/* CartProvider provides global cart data (like item count) */}
        <CartProvider>
          {/* BrowserRouter enables routing/navigation within the app */}
          <BrowserRouter>
            <Routes>
              {/* Login page route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Main layout route (App) that includes Navbar, Footer, and <Outlet /> */}
              <Route path="/" element={<App />}>
                {/* Default child route: shows ShoesPage at "/" */}
                <Route index element={<ShoesPage />} />

                {/* Protected cart page: requires user to be logged in */}
                <Route
                  path="cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected orders page: requires login as well */}
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>

          {/* ToastContainer displays notification messages (e.g., success, error) */}
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// main.jsx is the starting point of my React app.
// It sets up context providers, routing, global styling, and notifications — then renders everything inside.
