// DashboardCard.jsx
export default function DashboardCard({
  title,
  value,
  icon,
  change,
  changeType,
  gradient = "from-primary/15 to-primary/8", // Enhanced gradient opacity
}) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  const changeColor =
    changeType === "increase"
      ? "text-emerald-600"
      : changeType === "decrease"
      ? "text-rose-600"
      : "text-muted-foreground";

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradient}
        backdrop-blur-sm
        border border-border/50
        p-6 rounded-2xl 
        shadow-lg shadow-primary/10
        flex items-center justify-between
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-primary/20
        hover:-translate-y-1 hover:scale-[1.02]
        group cursor-pointer
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent
        before:translate-x-[-100%] before:transition-transform before:duration-1000
        hover:before:translate-x-[100%]
        h-40 w-full
      `}
      aria-label={`Dashboard metric: ${title}`}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-28 h-28 bg-primary rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary rounded-full translate-y-8 -translate-x-8"></div>
      </div>

      {/* Left Section: Title + Value + Change */}
      <div className="relative z-10 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
          {displayValue}
        </p>

        {change && (
          <div
            className={`text-xs flex items-center gap-2 ${changeColor} font-medium`}
          >
            {changeType === "increase" && (
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                <svg
                  className="w-3 h-3"
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
                <span className="text-xs font-bold">{change}</span>
              </div>
            )}
            {changeType === "decrease" && (
              <div className="flex items-center gap-1 bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                <svg
                  className="w-3 h-3"
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
                <span className="text-xs font-bold">{change}</span>
              </div>
            )}
            {!changeType && (
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-bold">
                {change}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Icon with enhanced styling */}
      <div className="relative z-10">
        <div
          className={`
            p-4 rounded-xl 
            bg-gradient-to-br from-primary to-secondary
            shadow-lg shadow-primary/25
            flex items-center justify-center
            transition-all duration-500
            group-hover:shadow-xl group-hover:shadow-primary/40
            group-hover:scale-110 group-hover:rotate-3
            text-primary-foreground
          `}
        >
          <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
}
