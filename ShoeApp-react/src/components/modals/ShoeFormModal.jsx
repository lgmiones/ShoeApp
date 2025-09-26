import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

// "nike.jpg" -> "/images/nike.jpg"
// keep as-is if already "/images/..." or full http(s) URL
const normalizeLocalImagePath = (value) => {
  if (!value) return "";
  const v = value.trim();
  if (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("/images/")
  )
    return v;
  return `/images/${v}`;
};

export default function ShoeFormModal({ isOpen, onClose, onSubmit, initial }) {
  // local form state (camelCase); mapped to PascalCase DTO on submit
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: 0,
    stock: 0,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // normalize initial values from API (GET returns lowercase keys)
  useEffect(() => {
    const norm = {
      name: initial?.name ?? initial?.Name ?? "",
      brand: initial?.brand ?? initial?.Brand ?? "",
      price: Number(initial?.price ?? initial?.Price ?? 0),
      stock: Number(initial?.stock ?? initial?.Stock ?? 0),
      imageUrl: initial?.imageUrl ?? initial?.ImageUrl ?? "",
    };
    if (isOpen) {
      setForm(norm);
      setTouched({});
      setErrors({});
      setLoading(false);
    }
  }, [initial, isOpen]);

  // simple validation (Swagger-ish)
  const validate = useMemo(() => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required.";
    if (!form.brand?.trim()) e.brand = "Brand is required.";

    if (form.price === "" || isNaN(form.price))
      e.price = "Price must be a number.";
    else if (Number(form.price) < 0) e.price = "Price cannot be negative.";

    if (form.stock === "" || isNaN(form.stock))
      e.stock = "Stock must be a number.";
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      e.stock = "Stock must be a non-negative integer.";
    }
    return e;
  }, [form]);

  const hasErrors = Object.keys(validate).length > 0;
  const markTouched = (k) => setTouched((t) => ({ ...t, [k]: true }));
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setTouched({
      name: true,
      brand: true,
      price: true,
      stock: true,
      imageUrl: true,
    });
    setErrors(validate);
    if (Object.keys(validate).length > 0) return;

    setLoading(true);
    const dto = {
      Name: form.name.trim(),
      Brand: form.brand.trim(),
      Price: Number(form.price),
      Stock: Number(form.stock),
      ImageUrl: form.imageUrl
        ? normalizeLocalImagePath(form.imageUrl)
        : undefined, // optional
    };
    await onSubmit(dto);
    setLoading(false);
  };

  const previewSrc = form.imageUrl
    ? normalizeLocalImagePath(form.imageUrl)
    : "/images/placeholder.png";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold">
                {initial ? "Edit Shoe" : "Add Shoe"}
              </Dialog.Title>

              <div className="mt-4 space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="shoe-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="shoe-name"
                    className={`mt-1 w-full rounded-lg border px-3 py-2 ${
                      touched.name && validate.name
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., Nike Air Max"
                    value={form.name}
                    onBlur={() => markTouched("name")}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  {touched.name && validate.name && (
                    <p className="mt-1 text-xs text-red-600">{validate.name}</p>
                  )}
                </div>

                {/* Brand */}
                <div>
                  <label
                    htmlFor="shoe-brand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Brand <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="shoe-brand"
                    className={`mt-1 w-full rounded-lg border px-3 py-2 ${
                      touched.brand && validate.brand
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., Nike"
                    value={form.brand}
                    onBlur={() => markTouched("brand")}
                    onChange={(e) => setField("brand", e.target.value)}
                  />
                  {touched.brand && validate.brand && (
                    <p className="mt-1 text-xs text-red-600">
                      {validate.brand}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="shoe-price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price (₱) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="shoe-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className={`mt-1 w-full rounded-lg border px-3 py-2 ${
                      touched.price && validate.price
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="5000"
                    value={form.price}
                    onBlur={() => markTouched("price")}
                    onChange={(e) => setField("price", e.target.value)}
                  />
                  {touched.price && validate.price && (
                    <p className="mt-1 text-xs text-red-600">
                      {validate.price}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label
                    htmlFor="shoe-stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="shoe-stock"
                    type="number"
                    min="0"
                    step="1"
                    className={`mt-1 w-full rounded-lg border px-3 py-2 ${
                      touched.stock && validate.stock
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 10"
                    value={form.stock}
                    onBlur={() => markTouched("stock")}
                    onChange={(e) => setField("stock", e.target.value)}
                  />
                  {touched.stock && validate.stock && (
                    <p className="mt-1 text-xs text-red-600">
                      {validate.stock}
                    </p>
                  )}
                </div>

                {/* Image URL + preview */}
                <div>
                  <label
                    htmlFor="shoe-image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image (filename or /images/path)
                  </label>
                  <input
                    id="shoe-image"
                    className="mt-1 w-full rounded-lg border px-3 py-2 border-gray-300"
                    placeholder="nike-kobe.jpg  or  /images/nike-kobe.jpg"
                    value={form.imageUrl}
                    onChange={(e) => setField("imageUrl", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Put the file in <code>public/images/</code>, then type the
                    filename.
                  </p>

                  <div className="mt-3">
                    <img
                      src={previewSrc}
                      alt={form.name || "Shoe preview"}
                      className="h-32 w-full max-w-[220px] rounded-lg object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="rounded-xl border px-3 py-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-blue-600 px-3 py-2 text-white disabled:opacity-60"
                  onClick={handleSubmit}
                  disabled={loading || hasErrors}
                  aria-disabled={loading || hasErrors}
                >
                  {initial ? "Save" : "Create"}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                <span className="text-red-600">*</span> required fields
              </p>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
