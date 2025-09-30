import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCart } from "../services/cart";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

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

  // local bump for optimistic updates
  const bump = useCallback((delta) => {
    setCount((c) => Math.max(0, c + Number(delta || 0)));
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
