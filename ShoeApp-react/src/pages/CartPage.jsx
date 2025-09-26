import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { success } from "../utils/toast";
import { getCart, clearCart } from "../services/cart";
import { placeOrder } from "../services/orders";

const FALLBACK_IMG = "/images/placeholder.jpg";
const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function CartPage() {
  const [items, setItems] = useState(null);

  async function fetchCart() {
    try {
      const list = await getCart();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load cart:", e);
      setItems([]);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  if (items === null) return <Loading />;

  const cartTotal = items.reduce((sum, i) => {
    const price = Number(i?.price ?? 0);
    const qty = Number(i?.quantity ?? 0);
    return sum + price * qty;
  }, 0);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Cart</h1>
        {items.length > 0 && (
          <button className="rounded-xl border px-3 py-2" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState title="Cart is empty" />
      ) : (
        <div className="space-y-3">
          {items.map((i, idx) => {
            const price = Number(i?.price ?? 0);
            const qty = Number(i?.quantity ?? 0);
            const subtotal = price * qty;
            const imgSrc = i?.imageUrl || FALLBACK_IMG;

            return (
              <div
                key={`${i?.shoeId ?? "item"}-${idx}`}
                className="flex items-center justify-between rounded-xl border bg-white p-3"
              >
                {/* Left: image + info */}
                <div className="flex items-center gap-3">
                  <img
                    src={imgSrc}
                    alt={i?.name ?? "Shoe"}
                    className="h-12 w-12 rounded-md object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                  <div>
                    <p className="font-medium">
                      {i?.name ?? `Shoe #${i?.shoeId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {qty} × {currency.format(price)}
                    </p>
                  </div>
                </div>

                {/* Right: subtotal */}
                <div className="font-semibold">{currency.format(subtotal)}</div>
              </div>
            );
          })}

          <div className="flex items-center justify-end border-t pt-4">
            <p className="text-lg font-semibold">
              Total: {currency.format(cartTotal)}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <button
          className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          onClick={onPlaceOrder}
          disabled={items.length === 0}
        >
          Place Order
        </button>
      </div>
    </section>
  );

  async function onClear() {
    await clearCart();
    success("Cart cleared");
    await fetchCart();
  }

  async function onPlaceOrder() {
    await placeOrder();
    success("Order placed!");
    await fetchCart();
  }
}
