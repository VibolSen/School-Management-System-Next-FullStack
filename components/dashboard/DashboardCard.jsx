// components/dashboard/DashboardCard.jsx
import Link from "next/link";

export default function DashboardCard({ title, value, icon, description, href }) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value || "—";

  const cardContent = (
    <div
      className="
        bg-white
        border border-gray-200
        rounded-lg
        p-3
        flex items-center justify-between
        shadow-sm
        hover:shadow-md
        transition
        h-22
      "
    >
      {/* Left: Info */}
      <div className="space-y-0.5">
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800">{displayValue}</p>
        {description && <p className="text-[10px] text-gray-400 leading-tight">{description}</p>}
      </div>

      {/* Right: Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-50 text-gray-600">
        {icon}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
