import { createBrowserRouter } from "react-router-dom";
import ShoesPage from "./pages/ShoesPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import App from "./App"; // Import the main layout or parent component that will hold <Outlet />

// Create and export the router configuration
export const router = createBrowserRouter([
  {
    path: "/",

    // The main component that will always render — contains <Outlet /> inside
    element: <App />,

    // Nested or child routes that will render inside App’s <Outlet />
    children: [
      {
        // The default child route — equivalent to path: "/"
        // When user visits "/", ShoesPage will show inside App’s <Outlet />
        index: true,
        element: <ShoesPage />,
      },
      {
        // Child route for "/cart"
        // When user visits "/cart", CartPage will show inside App’s <Outlet />
        path: "cart",
        element: <CartPage />,
      },
      {
        // Child route for "/orders"
        // When user visits "/orders", OrdersPage will show inside App’s <Outlet />
        path: "orders",
        element: <OrdersPage />,
      },
    ],
  },
]);

//The routes.jsx file organizes all your app’s pages and their URLs.
