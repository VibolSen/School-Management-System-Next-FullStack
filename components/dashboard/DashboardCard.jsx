// DashboardCard.jsx
export default function DashboardCard({
  title,
  value,
  icon,
  change,
  changeType,
  gradient = "from-gray-900 to-gray-800", // Dark, modern gradient
}) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  const changeColor =
    changeType === "increase"
      ? "text-green-400"
      : changeType === "decrease"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradient}
        border border-gray-700/50
        p-6 rounded-2xl 
        shadow-lg shadow-black/20
        flex items-center justify-between
        transition-all duration-300 ease-in-out
        hover:shadow-2xl hover:shadow-black/30
        hover:-translate-y-1.5
        group cursor-pointer
        text-white
        h-40 w-full
      `}
      aria-label={`Dashboard metric: ${title}`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 mix-blend-soft-light">
        <div
          className="absolute inset-0 bg-no-repeat bg-center"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM24 24c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM42 24c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM52 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6zM2 0h-2v2h2V0zm48 0h-2v2h2V0zM26 2h2V0h-2v2zM12 12h2v-2h-2v2zm28 0h2v-2h-2v2zM26 14h2v-2h-2v2z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Left Section: Title + Value + Change */}
      <div className="relative z-10 space-y-2">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-4xl font-black text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 transition-colors duration-300">
          {displayValue}
        </p>

        {change && (
          <div className={`text-xs flex items-center gap-1.5 ${changeColor} font-semibold`}>
            {changeType === "increase" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 11-2 0 1 1 0 012 0zm-2 3a1 1 0 100 2h2a1 1 0 100-2h-2zM5 10a1 1 0 11-2 0 1 1 0 012 0zM15 10a1 1 0 11-2 0 1 1 0 012 0z"
                  clipRule="evenodd"
                />
                <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Right Section: Icon */}
      <div className="relative z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 flex items-center justify-center text-white">{icon}</div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute top-0 left-0 h-full w-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out"
      ></div>
    </div>
  );
}