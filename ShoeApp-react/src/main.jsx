import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

import App from "./App";
import ShoesPage from "./pages/ShoesPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ShoesPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ChakraProvider>
  </React.StrictMode>
);
