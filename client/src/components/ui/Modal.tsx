import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modalRef.current.addEventListener("keydown", trap);
    return () => modalRef.current?.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all duration-200">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative max-w-lg w-full mx-4 animate-fade-in-up"
        aria-modal="true"
        role="dialog"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-t-4 border-purple-500 dark:border-purple-400 transition-all duration-200 p-0">
          <button
            className="absolute top-3 right-3 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full bg-purple-50 dark:bg-purple-900/30 p-1 transition-colors duration-150"
            onClick={onClose}
            aria-label="Close"
            tabIndex={0}
          >
            &times;
          </button>
          {title && (
            <div className="px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            </div>
          )}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
      {/* Backdrop click closes modal */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
};

export default Modal;

// Animations (add to your global CSS if not present):
// .animate-fade-in-up { animation: fadeInUp 0.2s cubic-bezier(.4,0,.2,1); }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } } 