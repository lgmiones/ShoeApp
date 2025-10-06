// Export a functional component called Loading
// It shows a spinning circle animation while waiting for data or an API response
export default function Loading() {
  return (
    // Outer container: centers the spinner horizontally and vertically
    <div className="flex items-center justify-center py-16">
      {/* Spinner element: a circle that rotates continuously */}
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
    </div>
  );
}
