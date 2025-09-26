export default function EmptyState({ title, subtitle }) {
  return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-lg font-medium">{title}</p>
      {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
