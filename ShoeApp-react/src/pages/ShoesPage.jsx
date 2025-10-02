import { useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ShoeFormModal from "../components/modals/ShoeFormModal";
import ConfirmDialog from "../components/modals/ConfirmDialog";
import { success } from "../utils/toast";
import {
  getShoes,
  createShoe,
  updateShoe,
  deleteShoe,
} from "../services/shoes";
import { addToCart } from "../services/cart";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

export default function ShoesPage() {
  const [shoes, setShoes] = useState(null);
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [openQuantity, setOpenQuantity] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isAdmin } = useAuth();
  const { bump: bumpCart } = useCart();

  const FALLBACK_SRC = "/images/placeholder.jpg";

  const fetchShoes = async () => {
    try {
      const list = await getShoes();
      setShoes(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load shoes:", e);
      setShoes([]);
    }
  };

  useEffect(() => {
    fetchShoes();
  }, []);

  const filtered = useMemo(() => {
    const list = Array.isArray(shoes) ? shoes : [];
    const q = query.toLowerCase();
    return list.filter((s) =>
      [s.name, s.brand].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [shoes, query]);

  const createOrUpdate = async (dtoPascal) => {
    if (editing) {
      await updateShoe(editing.id, dtoPascal);
      success("Shoe updated");
    } else {
      await createShoe(dtoPascal);
      success("Shoe created");
    }
    setOpenForm(false);
    setEditing(null);
    await fetchShoes();
  };

  const remove = async () => {
    if (!deleting) return;
    // Optimistic delete
    const prev = shoes;
    setShoes((list) => list.filter((x) => x.id !== deleting.id));
    setDeleting(null);
    try {
      await deleteShoe(deleting.id);
      success("Shoe deleted");
    } catch (e) {
      setShoes(prev); // rollback
      throw e;
    }
  };

  if (shoes === null) return <Loading />;

  return (
    <section className="space-y-6">
      {/* Fancy header */}
      <div className="rounded-3xl border bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white grid place-items-center">
              <span className="text-sm font-bold">zF</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Shoes</h1>
              <p className="text-xs text-gray-500">
                Find your next favorite pair.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-[260px] rounded-xl border px-3 py-2 text-sm"
              placeholder="Search by name or brand…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isAdmin && (
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                onClick={() => setOpenForm(true)}
              >
                + Add Shoe
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No shoes found"
          subtitle={
            query ? `No results for "${query}"` : "Add one to get started"
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const stock = Number(s.stock || 0);
            const low = stock > 0 && stock < 2;
            const out = stock <= 0;
            const price = Number(s.price || 0);

            return (
              <li
                key={s.id}
                className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-lg"
              >
                <div className="relative mb-3 flex justify-center">
                  <img
                    src={s.imageUrl || FALLBACK_SRC}
                    alt={s.name}
                    className="h-36 w-full max-w-[220px] rounded-xl object-cover"
                    onError={(e) => {
                      if (!e.currentTarget.src.endsWith(FALLBACK_SRC))
                        e.currentTarget.src = FALLBACK_SRC;
                    }}
                  />
                  {/* Stock ribbons */}
                  {low && !out && (
                    <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                      <span className="mr-1">⚠</span> {stock} left
                    </span>
                  )}
                  {out && (
                    <span className="absolute left-2 top-2 rounded-md bg-gray-400 px-2 py-0.5 text-xs font-semibold text-white shadow">
                      Out of stock
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.name}</p>
                    {s.brand && (
                      <p className="truncate text-sm text-gray-500">
                        {s.brand}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">Stock: {stock}</p>
                  </div>
                  <p className="shrink-0 font-semibold">
                    ₱{price.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className={`flex-1 rounded-xl border px-3 py-2 ${
                      out
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "hover:bg-green-300 transition-colors"
                    }`}
                    onClick={() => {
                      setSelectedShoe(s);
                      setQuantity(1);
                      setOpenQuantity(true);
                    }}
                    disabled={out}
                  >
                    {out ? "Out of Stock" : "Add to Cart"}
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        className="rounded-xl border px-3 py-2 hover:bg-yellow-300 transition-colors"
                        onClick={() => {
                          setEditing(s);
                          setOpenForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-xl border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => setDeleting(s)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Add/Edit modal */}
      <ShoeFormModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSubmit={createOrUpdate}
        initial={editing}
      />

      {/* Confirm delete modal */}
      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete this shoe?"
        body={<p>"{deleting?.name}" will be removed permanently.</p>}
        confirmText="Delete"
      />

      {/* Quantity selection modal */}
      {openQuantity && selectedShoe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">
              How many "{selectedShoe.name}"?
            </h2>
            <input
              type="number"
              min={1}
              max={selectedShoe.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="mb-4 w-full rounded-lg border px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg border px-4 py-2"
                onClick={() => setOpenQuantity(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                onClick={async () => {
                  // Optimistic: bump cart count immediately
                  bumpCart(quantity);
                  try {
                    await addToCart(selectedShoe.id, quantity);
                    success(`Added ${quantity} to cart`);
                  } catch (e) {
                    // rollback if you want: bumpCart(-quantity);
                    throw e;
                  } finally {
                    setOpenQuantity(false);
                    setSelectedShoe(null);
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
