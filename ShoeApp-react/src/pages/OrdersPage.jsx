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
    await deleteOrder(deleting.Id);
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
            <div key={o.Id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Order #{o.Id}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500">
                    {o.CreatedAt ? new Date(o.CreatedAt).toLocaleString() : ""}
                  </p>
                  <p className="font-semibold">
                    ₱{Number(o.TotalPrice || 0).toLocaleString()}
                  </p>
                  <button
                    className="rounded-xl border border-red-300 px-3 py-2 text-red-600"
                    onClick={() => setDeleting(o)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
                {(o.Items || []).map((it, idx) => (
                  <li key={idx}>
                    Shoe #{it.ShoeId} × {it.Quantity} — ₱
                    {Number(it.Price || 0).toLocaleString()}
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
        title="Delete this order?"
        confirmText="Delete"
      />
    </section>
  );
}
