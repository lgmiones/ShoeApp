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

export default function ShoesPage() {
  const [shoes, setShoes] = useState(null);
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // 👇 new states for cart quantity modal
  const [openQuantity, setOpenQuantity] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
    await deleteShoe(deleting.id);
    success("Shoe deleted");
    setDeleting(null);
    await fetchShoes();
  };

  if (shoes === null) return <Loading />;

  const FALLBACK_SRC = "/images/placeholder.jpg";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <input
          className="w-full max-w-md rounded-lg border px-3 py-2"
          placeholder="Search shoes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          onClick={() => setOpenForm(true)}
        >
          + Add Shoe
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No shoes yet" subtitle="Add one to get started" />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li
              key={s.id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex justify-center">
                <img
                  src={s.imageUrl || FALLBACK_SRC}
                  alt={s.name}
                  className="h-32 w-full max-w-[180px] rounded-lg object-cover"
                  onError={(e) => {
                    if (!e.currentTarget.src.endsWith(FALLBACK_SRC))
                      e.currentTarget.src = FALLBACK_SRC;
                  }}
                />
              </div>

              <div className="mt-1 flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  {s.brand && (
                    <p className="text-sm text-gray-500">{s.brand}</p>
                  )}
                  <p className="text-xs text-gray-500">Stock: {s.stock}</p>
                </div>
                <p className="font-semibold">
                  ₱{Number(s.price).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className={`flex-1 rounded-xl border px-3 py-2 ${
                    s.stock <= 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedShoe(s);
                    setQuantity(1);
                    setOpenQuantity(true);
                  }}
                  disabled={s.stock <= 0}
                >
                  {s.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  className="rounded-xl border px-3 py-2"
                  onClick={() => {
                    setEditing(s);
                    setOpenForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="rounded-xl border border-red-300 px-3 py-2 text-red-600"
                  onClick={() => setDeleting(s)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="rounded-xl bg-white p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              How many "{selectedShoe.name}"?
            </h2>
            <input
              type="number"
              min={1}
              max={selectedShoe.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 mb-4"
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
                  await addToCart(selectedShoe.id, quantity);
                  success(`Added ${quantity} to cart`);
                  setOpenQuantity(false);
                  setSelectedShoe(null);
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
