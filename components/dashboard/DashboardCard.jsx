import React from "react";

export default function DashboardCard({
  title,
  value,
  icon,
  change,
  changeType,
  colorClass = "text-blue-600 bg-blue-100", // default color
}) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  const changeColor =
    changeType === "increase"
      ? "text-green-500"
      : changeType === "decrease"
      ? "text-red-500"
      : "text-slate-500";

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between
                 transition hover:shadow-xl hover:-translate-y-1 duration-200"
      aria-label={`Dashboard metric: ${title}`}
    >
      {/* Left Section: Title + Value + Change */}
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{displayValue}</p>

        {change && (
          <div className={`text-sm flex items-center mt-1 ${changeColor}`}>
            {changeType === "increase" && (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7 7 7M12 3v18"
                />
              </svg>
            )}
            {changeType === "decrease" && (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7-7-7M12 21V3"
                />
              </svg>
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Right Section: Icon */}
      <div
        className={`p-4 rounded-full flex items-center justify-center ${colorClass}`}
      >
        {icon}
      </div>
    </div>
  );
}
