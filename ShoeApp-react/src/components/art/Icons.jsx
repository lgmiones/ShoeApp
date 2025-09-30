// src/components/art/Icons.jsx
export function ShoeIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 16c5-.4 9-2.3 12-6 1-.9 2.1-.6 2.9.3 1.3 1.5 3.1 2.4 5.1 2.7v2.3c0 1.1-.9 2-2 2H6a3 3 0 0 1-3-1.3z" />
      <path d="M7 14c.6-.1 1.1-.7 1.4-1.4M11 12c.5.5 1.2.9 1.9 1.1" />
    </svg>
  );
}

export function CartIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 5h2l2 10h10l2-7H7" />
      <circle cx="10" cy="18" r="1.6" />
      <circle cx="16" cy="18" r="1.6" />
    </svg>
  );
}

export function OrderIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h6M8 16h8" />
      <path d="M10 3l2 2 2-2" />
    </svg>
  );
}
