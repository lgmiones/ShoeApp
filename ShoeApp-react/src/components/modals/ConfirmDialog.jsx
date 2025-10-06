import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

// ConfirmDialog component is a reusable confirmation popup (modal)
export default function ConfirmDialog({
  isOpen, // Boolean → controls if the dialog is visible
  onClose, // Function → called when "Cancel" or backdrop is clicked
  onConfirm, // Function → called when "Confirm" button is clicked
  title, // String → title text displayed at the top of dialog
  body, // String → optional body text explaining details
  confirmText = "Confirm", // Default text for confirm button
  isLoading, // Boolean → disables button + shows loading state if true
}) {
  return (
    // Transition wrapper → handles animation when opening/closing
    <Transition show={isOpen} as={Fragment}>
      {/* HeadlessUI's Dialog component → accessible modal */}
      <Dialog onClose={onClose} className="relative z-50">
        {/* --- Backdrop (dark overlay behind the dialog) --- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" // animation when opening
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150" // animation when closing
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
          {/* full-screen semi-transparent background */}
        </Transition.Child>

        {/* --- Centered Panel (actual dialog box) --- */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95" // start smaller + invisible
            enterTo="opacity-100 scale-100" // animate to full size + visible
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* The white dialog box */}
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Dialog title (always shown) */}
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>

              {/* Optional body/description text */}
              {body && (
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  {body}
                </Dialog.Description>
              )}

              {/* --- Action buttons (Cancel / Confirm) --- */}
              <div className="mt-6 flex justify-end gap-2">
                {/* Cancel button → closes dialog */}
                <button
                  className="rounded-xl border px-3 py-2"
                  onClick={onClose}
                  aria-label="Cancel"
                >
                  Cancel
                </button>

                {/* Confirm button → triggers onConfirm function */}
                <button
                  className="rounded-xl bg-red-600 px-3 py-2 text-white disabled:opacity-60"
                  onClick={onConfirm}
                  disabled={isLoading} // disable when loading
                  aria-busy={isLoading ? "true" : "false"} // accessibility
                >
                  {confirmText} {/* Dynamic button text */}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
