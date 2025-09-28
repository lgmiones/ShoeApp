import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/modals/ConfirmDialog";
import { success } from "../utils/toast";
import { getOrders, deleteOrder } from "../services/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchOrders = async () => {
    try {
      const list = await getOrders();
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load orders:", e);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const remove = async () => {
    if (!deleting) return;
    await deleteOrder(deleting.id); // ✅ backend uses "id"
    success("Order deleted");
    setDeleting(null);
    await fetchOrders();
  };

  if (orders === null) return <Loading />;

  return (
    <section className="space-y-6">
      <h1 className="text-xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Order #{o.id}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : ""}
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

              {/* ✅ Show order items with full details */}
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {(o.items || []).map((it, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 border-b pb-2 last:border-none"
                  >
                    {/* Shoe image */}
                    <img
                      src={it.imageUrl || "/images/placeholder.jpg"}
                      alt={it.name || "Shoe"}
                      className="h-12 w-12 rounded object-cover border"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{it.name}</p>
                      <p className="text-xs text-gray-500">{it.brand}</p>
                      <p className="text-xs">
                        Qty: {it.quantity} × ₱
                        {Number(it.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium">
                      ₱{Number(it.quantity * it.price).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

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
