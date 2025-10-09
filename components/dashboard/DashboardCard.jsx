// components/dashboard/DashboardCard.jsx
export default function DashboardCard({ title, value, icon, description }) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value || "—";

  return (
    <div
      className="
        bg-white
        border border-gray-200
        rounded-lg
        p-4
        flex items-center justify-between
        shadow-sm
        hover:shadow-md
        transition
        h-28
      "
    >
      {/* Left: Info */}
      <div className="space-y-1">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{displayValue}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>

      {/* Right: Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gray-100 text-gray-600">
        {icon}
      </div>
    </div>
  );
}
