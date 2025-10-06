import { useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/modals/ConfirmDialog";
import { success } from "../utils/toast";
import { getOrders, deleteOrder } from "../services/orders";
import { useAuth } from "../state/AuthContext";

// OrdersPage component — displays and manages customer/admin orders
export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const { isAdmin } = useAuth();

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      setBusy(true);
      const list = await getOrders(isAdmin);
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load orders:", e);
      setOrders([]);
    } finally {
      setBusy(false);
    }
  };

  // Fetch orders on initial load or when admin status changes
  useEffect(() => {
    fetchOrders();
  }, [isAdmin]);

  // Filter orders by email (for admin users)
  const filtered = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    if (!isAdmin || !emailFilter.trim()) return orders;
    const q = emailFilter.toLowerCase();

    return orders.filter((o) => (o.userEmail || "").toLowerCase().includes(q));
  }, [orders, emailFilter, isAdmin]);

  // Function to handle deleting an order
  const remove = async () => {
    if (!deleting) return;

    const prev = orders;
    setOrders((list) => list.filter((o) => o.id !== deleting.id));
    setDeleting(null);

    try {
      await deleteOrder(deleting.id);
      success("Order deleted");
    } catch (e) {
      setOrders(prev);
      throw e;
    }
  };

  // Show loading indicator while fetching
  if (orders === null) return <Loading />;

  return (
    <section className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Orders</h1>
          {/* Show admin label if viewing all users’ orders */}
          {isAdmin && filtered.length > 0 && (
            <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              Admin: showing all customers’ orders
            </span>
          )}
        </div>

        {/* Filter and refresh controls */}
        <div className="flex items-center gap-2">
          {/* Email filter visible only for admin */}
          {isAdmin && (
            <input
              className="rounded-lg border px-3 py-2 text-sm"
              placeholder="Filter by customer email…"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          )}
          {/* Refresh button */}
          <button
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-200 disabled:opacity-60"
            onClick={fetchOrders}
            disabled={busy}
          >
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Display orders or empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No orders found"
          subtitle={
            isAdmin && emailFilter ? `No results for "${emailFilter}"` : ""
          }
        />
      ) : (
        <div className="space-y-3">
          {/* Loop through each order */}
          {filtered.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Order #{o.id}</p>
                  {/* Show email if available (admin view) */}
                  {o.userEmail && (
                    <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {o.userEmail}
                    </span>
                  )}
                </div>

                {/* Order details and delete button */}
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                  </p>
                  <p className="font-semibold">
                    ₱{Number(o.totalPrice || 0).toLocaleString()}
                  </p>
                  <button
                    className="rounded-xl border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
                    onClick={() => setDeleting(o)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* List of items inside each order */}
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {(o.items || []).map((it, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 border-b pb-2 last:border-none"
                  >
                    {/* Product image with fallback */}
                    <img
                      src={it.imageUrl || "/images/placeholder.jpg"}
                      alt={it.name || "Shoe"}
                      className="h-12 w-12 rounded object-cover border"
                      onError={(e) => {
                        if (
                          !e.currentTarget.src.endsWith(
                            "/images/placeholder.jpg"
                          )
                        ) {
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{it.name}</p>
                      <p className="text-xs text-gray-500">{it.brand}</p>
                      <p className="text-xs">
                        Qty: {Number(it.quantity || 0)} × ₱
                        {Number(it.price || 0).toLocaleString()}
                      </p>
                    </div>
                    {/* Subtotal for this item */}
                    <p className="font-medium">
                      ₱
                      {Number(
                        (it.quantity || 0) * (it.price || 0)
                      ).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Are you sure you want to Delete or Cancel this order?"
        confirmText="Yes"
      />
    </section>
  );
}
