import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCart } from "../services/cart";

// 🧠 Create a React Context to share cart state (e.g., item count) across the entire app
const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  /**
   * 🔄 refreshCount - Fetches cart items from the backend and recalculates the total quantity.
   */
  const refreshCount = useCallback(async () => {
    try {
      const items = await getCart();

      const total = (items || []).reduce(
        (sum, i) => sum + Number(i.quantity || 0),
        0
      );
      setCount(total);
    } catch {
      setCount(0);
    } finally {
      setReady(true);
    }
  }, []);

  const bump = useCallback((delta) => {
    setCount((c) => Math.max(0, c + Number(delta || 0))); // Prevents negative numbers
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <CartCtx.Provider value={{ ready, count, refreshCount, bump }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  return useContext(CartCtx);
}

//CartContext.jsx is responsible for managing the total item count and refresh state of your user’s shopping cart.
