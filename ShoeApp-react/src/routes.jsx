import { createBrowserRouter } from "react-router-dom";
import ShoesPage from "./pages/ShoesPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ShoesPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "orders", element: <OrdersPage /> },
    ],
  },
]);
