// Import necessary React hooks and components
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { success } from "../utils/toast";
import { getCart, clearCart, deleteCartItem } from "../services/cart";
import { placeOrder } from "../services/orders";
import { useCart } from "../state/CartContext";

// 🖼️ Default placeholder image if product image fails to load
const FALLBACK_SRC = "/images/placeholder.jpg";

// 💰 Currency formatter for PHP
const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

// 🛒 CartPage Component
export default function CartPage() {
  const [items, setItems] = useState(null);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // ✅ Access cart context (for global cart badge and updates)
  const { count, refreshCount, bump } = useCart();

  // 🔄 Function to fetch cart items from the API
  async function fetchCart() {
    try {
      const list = await getCart();
      setItems(Array.isArray(list) ? list : []);
      await refreshCount();
    } catch (e) {
      console.error("Failed to load cart:", e);
      setItems([]);
    }
  }

  // 🪄 useEffect runs once on page load to fetch cart data
  useEffect(() => {
    fetchCart();
  }, []);

  // 🌀 Show loading spinner while fetching
  if (items === null) return <Loading />;

  // 🧮 Compute total price of cart
  const cartTotal = items.reduce((sum, i) => {
    const price = Number(i?.price ?? 0);
    const qty = Number(i?.quantity ?? 0);
    return sum + price * qty;
  }, 0);

  // 🧹 Function to clear the entire cart
  async function onClear() {
    const snapshot = items;
    const prevCount = count;

    setItems([]);
    bump(-prevCount);

    try {
      await clearCart();
      success("Cart cleared");
      await refreshCount();
    } catch (e) {
      // rollback if failed
      setItems(snapshot);
      bump(prevCount);
      throw e;
    }
  }

  // 🧾 Function to place an order
  async function onPlaceOrder() {
    const snapshot = items;
    const prevCount = count;

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

  // ❌ Function to delete a single item from the cart
  async function onDeleteItem(id) {
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
      {/* 🏷️ Header with title and clear button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Cart</h1>
        {items.length > 0 && (
          <button
            className="rounded-xl border px-3 py-2 hover:bg-gray-200"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>

      {/* 🧺 Display cart items or empty state */}
      {items.length === 0 ? (
        <EmptyState title="Cart is empty" />
      ) : (
        <div className="space-y-3">
          {/* Loop through all items in the cart */}
          {items.map((i, idx) => {
            const price = Number(i?.price ?? 0);
            const qty = Number(i?.quantity ?? 0);
            const subtotal = price * qty;

            return (
              <div
                key={i?.id ?? idx}
                className="flex items-center justify-between rounded-xl border bg-white p-3"
              >
                {/* 👟 Left: image and shoe details */}
                <div className="flex items-center gap-3">
                  <img
                    src={i?.imageUrl || FALLBACK_SRC}
                    alt={i?.name ?? "Shoe"}
                    className="h-12 w-12 rounded-md object-cover"
                    onError={(e) => {
                      // fallback to placeholder if image fails
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

                {/* 💸 Right: subtotal and delete button */}
                <div className="flex items-center gap-4">
                  <div className="font-semibold">
                    {currency.format(subtotal)}
                  </div>
                  {Boolean(i?.id) && (
                    <button
                      className="px-2 py-1 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700"
                      onClick={() => setDeleteItemId(i.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* 🧮 Display cart total */}
          <div className="flex items-center justify-end border-t pt-4">
            <p className="text-lg font-semibold">
              Total: {currency.format(cartTotal)}
            </p>
          </div>
        </div>
      )}

      {/* 🛍️ Place Order button */}
      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <button
          className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-60 hover:bg-blue-400"
          onClick={() => setShowOrderConfirm(true)}
          disabled={items.length === 0}
        >
          Place Order
        </button>
      </div>

      {/* 🪧 Place Order confirmation modal */}
      {showOrderConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Confirm Order</h2>
            <p className="mb-6">Are you sure you want to place this order?</p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-xl border px-4 py-2 hover:bg-gray-200"
                onClick={() => setShowOrderConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-400"
                onClick={async () => {
                  setShowOrderConfirm(false);
                  await onPlaceOrder(); // trigger placing order
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ❌ Delete Item confirmation modal */}
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
                  await onDeleteItem(deleteItemId); // confirm deletion
                  setDeleteItemId(null); // close modal
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
