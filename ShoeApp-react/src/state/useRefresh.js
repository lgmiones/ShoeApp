import { useState, useCallback } from "react";

// Custom hook for forcing a component to re-render manually
export default function useRefresh() {
  // 'tick' is a simple counter; changing it causes a re-render
  const [tick, setTick] = useState(0);

  // 'refresh' increments 'tick' — triggering any useEffect() that depends on it
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Return both 'tick' (used as dependency) and 'refresh' (used to trigger updates)
  return { tick, refresh };
}
/*The useRefresh hook helps refresh components when data changes, such as when the shoe stock decreases after an order.
It doesn’t modify the stock directly — instead, it triggers a re-render 
so the component can fetch and display the updated stock from the backend.”*/
