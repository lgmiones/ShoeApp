import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmText = "Confirm",
  isLoading,
}) {
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
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
              {body && (
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  {body}
                </Dialog.Description>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="rounded-xl border px-3 py-2"
                  onClick={onClose}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-red-600 px-3 py-2 text-white disabled:opacity-60"
                  onClick={onConfirm}
                  disabled={isLoading}
                  aria-busy={isLoading ? "true" : "false"}
                >
                  {confirmText}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
