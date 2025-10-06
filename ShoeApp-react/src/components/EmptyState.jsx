// Export a functional component called EmptyState
// It displays a simple message when there’s no data or content to show
export default function EmptyState({ title, subtitle }) {
  return (
    // Main container centered with padding and gray text color
    <div className="text-center py-16 text-gray-500">
      {/* Title section: larger and bold text */}
      <p className="text-lg font-medium">{title}</p>

      {/* Subtitle (optional) — shown only if 'subtitle' is provided */}
      {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
