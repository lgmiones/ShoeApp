// Import React hooks for state and lifecycle management
import { useEffect, useMemo, useState } from "react";

// Import custom components for UI and modals
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ShoeFormModal from "../components/modals/ShoeFormModal";
import ConfirmDialog from "../components/modals/ConfirmDialog";

// Import a success toast message function
import { success } from "../utils/toast";

// Import API service functions for managing shoes and cart
import {
  getShoes,
  createShoe,
  updateShoe,
  deleteShoe,
} from "../services/shoes";
import { addToCart } from "../services/cart";

// Import authentication and cart context hooks
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

export default function ShoesPage() {
  // ---------------- State variables ----------------
  const [shoes, setShoes] = useState(null); // List of shoes
  const [query, setQuery] = useState(""); // Search input
  const [openForm, setOpenForm] = useState(false); // Shoe form modal visibility
  const [editing, setEditing] = useState(null); // Shoe being edited
  const [deleting, setDeleting] = useState(null); // Shoe being deleted
  const [openQuantity, setOpenQuantity] = useState(false); // Quantity modal visibility
  const [selectedShoe, setSelectedShoe] = useState(null); // Shoe selected for adding to cart
  const [quantity, setQuantity] = useState(1); // Quantity to add to cart

  // Hooks for authentication (check if admin) and cart (update cart count)
  const { isAdmin } = useAuth();
  const { bump: bumpCart } = useCart();

  const FALLBACK_SRC = "/images/placeholder.jpg"; // Default shoe image

  // ---------------- Fetch all shoes ----------------
  const fetchShoes = async () => {
    try {
      const list = await getShoes(); // Fetch shoes from API
      setShoes(Array.isArray(list) ? list : []); // Store result in state
    } catch (e) {
      console.error("Failed to load shoes:", e);
      setShoes([]); // Show empty list if error occurs
    }
  };

  // Fetch shoes once when component loads
  useEffect(() => {
    fetchShoes();
  }, []);

  // ---------------- Filter shoes based on search ----------------
  const filtered = useMemo(() => {
    const list = Array.isArray(shoes) ? shoes : [];
    const q = query.toLowerCase();
    // Search by name or brand (case-insensitive)
    return list.filter((s) =>
      [s.name, s.brand].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [shoes, query]);

  // ---------------- Create or update shoe ----------------
  const createOrUpdate = async (dtoPascal) => {
    if (editing) {
      // Update existing shoe
      await updateShoe(editing.id, dtoPascal);
      success("Shoe updated");
    } else {
      // Create new shoe
      await createShoe(dtoPascal);
      success("Shoe created");
    }
    setOpenForm(false);
    setEditing(null);
    await fetchShoes(); // Refresh list after update
  };

  // ---------------- Delete a shoe ----------------
  const remove = async () => {
    if (!deleting) return;

    // Optimistic delete (remove from UI before confirming)
    const prev = shoes;
    setShoes((list) => list.filter((x) => x.id !== deleting.id));
    setDeleting(null);

    try {
      await deleteShoe(deleting.id);
      success("Shoe deleted");
    } catch (e) {
      // Rollback if API fails
      setShoes(prev);
      throw e;
    }
  };

  // Show loading indicator while data is being fetched
  if (shoes === null) return <Loading />;

  return (
    <section className="space-y-6">
      {/* ---------------- Header with search and add button ---------------- */}
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
            {/* Search input for name or brand */}
            <input
              className="w-[260px] rounded-xl border px-3 py-2 text-sm"
              placeholder="Search by name or brand…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* Add button for admin users only */}
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

      {/* ---------------- Show list or empty state ---------------- */}
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
            const low = stock > 0 && stock < 2; // Low stock warning
            const out = stock <= 0; // Out of stock
            const price = Number(s.price || 0);

            return (
              <li
                key={s.id}
                className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-lg"
              >
                {/* ---------------- Shoe image with stock ribbon ---------------- */}
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
                  {/* Show low stock or out of stock label */}
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

                {/* ---------------- Shoe info ---------------- */}
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

                {/* ---------------- Buttons for Add/Edit/Delete ---------------- */}
                <div className="mt-4 flex gap-2">
                  {/* Add to Cart button */}
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

                  {/* Admin buttons: Edit and Delete */}
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

      {/* ---------------- Shoe form modal for adding/editing ---------------- */}
      <ShoeFormModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSubmit={createOrUpdate}
        initial={editing}
      />

      {/* ---------------- Delete confirmation modal ---------------- */}
      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete this shoe?"
        body={<p>"{deleting?.name}" will be removed permanently.</p>}
        confirmText="Delete"
      />

      {/* ---------------- Quantity selection modal ---------------- */}
      {openQuantity && selectedShoe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">
              How many "{selectedShoe.name}"?
            </h2>

            {/* Quantity input field */}
            <input
              type="number"
              min={1}
              max={selectedShoe.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="mb-4 w-full rounded-lg border px-3 py-2"
            />

            {/* Buttons for adding to cart or canceling */}
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
                  // Optimistic UI update — instantly increase cart count
                  bumpCart(quantity);
                  try {
                    await addToCart(selectedShoe.id, quantity);
                    success(`Added ${quantity} to cart`);
                  } catch (e) {
                    // Could rollback cart here if needed
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
