import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { success } from "../utils/toast";
import { getCart, clearCart, deleteCartItem } from "../services/cart";
import { placeOrder } from "../services/orders";
import { useCart } from "../state/CartContext";

const FALLBACK_SRC = "/images/placeholder.jpg";
const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function CartPage() {
  const [items, setItems] = useState(null);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // ✅ hooks belong inside the component
  const { count, refreshCount, bump } = useCart();

  async function fetchCart() {
    try {
      const list = await getCart();
      setItems(Array.isArray(list) ? list : []);
      // keep badge in sync whenever we fetch
      await refreshCount();
    } catch (e) {
      console.error("Failed to load cart:", e);
      setItems([]);
    }
  }

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items === null) return <Loading />;

  const cartTotal = items.reduce((sum, i) => {
    const price = Number(i?.price ?? 0);
    const qty = Number(i?.quantity ?? 0);
    return sum + price * qty;
  }, 0);

  async function onClear() {
    const snapshot = items;
    const prevCount = count;

    // Optimistic: zero UI & badge
    setItems([]);
    bump(-prevCount);

    try {
      await clearCart();
      success("Cart cleared");
      await refreshCount(); // hard-sync from server
    } catch (e) {
      // rollback UI & badge
      setItems(snapshot);
      bump(prevCount);
      throw e;
    }
  }

  async function onPlaceOrder() {
    const snapshot = items;
    const prevCount = count;

    // Optimistic
    setItems([]);
    bump(-prevCount);

    try {
      await placeOrder();
      success("Order placed!");
      await refreshCount();
    } catch (e) {
      setItems(snapshot);
      bump(prevCount);
      throw e;
    }
  }

  async function onDeleteItem(id) {
    // If backend returns per-item IDs, we can optimistically adjust the badge
    const victim = items.find((x) => x.id === id);
    const qty = Number(victim?.quantity || 0);

    const prev = items;
    setItems(prev.filter((x) => x.id !== id));
    if (qty) bump(-qty);

    try {
      await deleteCartItem(id);
      success("Item removed from cart");
      await refreshCount();
    } catch (e) {
      setItems(prev);
      if (qty) bump(qty);
      throw e;
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Cart</h1>
        {items.length > 0 && (
          <button className="rounded-xl border px-3 py-2" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {/* Cart Items */}
      {items.length === 0 ? (
        <EmptyState title="Cart is empty" />
      ) : (
        <div className="space-y-3">
          {items.map((i, idx) => {
            const price = Number(i?.price ?? 0);
            const qty = Number(i?.quantity ?? 0);
            const subtotal = price * qty;

            return (
              <div
                key={i?.id ?? idx}
                className="flex items-center justify-between rounded-xl border bg-white p-3"
              >
                {/* Left: image + info */}
                <div className="flex items-center gap-3">
                  <img
                    src={i?.imageUrl || FALLBACK_SRC}
                    alt={i?.name ?? "Shoe"}
                    className="h-12 w-12 rounded-md object-cover"
                    onError={(e) => {
                      if (!e.currentTarget.src.endsWith(FALLBACK_SRC)) {
                        e.currentTarget.src = FALLBACK_SRC;
                      }
                    }}
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

                {/* Right: subtotal + delete */}
                <div className="flex items-center gap-4">
                  <div className="font-semibold">
                    {currency.format(subtotal)}
                  </div>
                  {Boolean(i?.id) && (
                    <button
                      className="px-2 py-1 rounded-xl bg-red-600 text-white text-sm"
                      onClick={() => setDeleteItemId(i.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="flex items-center justify-end border-t pt-4">
            <p className="text-lg font-semibold">
              Total: {currency.format(cartTotal)}
            </p>
          </div>
        </div>
      )}

      {/* Place Order Button */}
      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <button
          className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          onClick={() => setShowOrderConfirm(true)}
          disabled={items.length === 0}
        >
          Place Order
        </button>
      </div>

      {/* Place Order Confirmation Modal */}
      {showOrderConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Confirm Order</h2>
            <p className="mb-6">Are you sure you want to place this order?</p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-xl border px-4 py-2"
                onClick={() => setShowOrderConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                onClick={async () => {
                  setShowOrderConfirm(false);
                  await onPlaceOrder();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deleteItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Delete Item</h2>
            <p className="mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-xl border px-4 py-2"
                onClick={() => setDeleteItemId(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-red-600 px-4 py-2 text-white"
                onClick={async () => {
                  await onDeleteItem(deleteItemId);
                  setDeleteItemId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
