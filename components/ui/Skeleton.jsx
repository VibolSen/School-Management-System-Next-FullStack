import React from "react";

/**
 * A versatile Skeleton component for shimmering content placeholders.
 */
const Skeleton = ({ className = "", variant = "rect" }) => {
  const variants = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "h-4 rounded",
  };

  return (
    <div
      className={`
        animate-pulse
        bg-gray-200/80
        relative
        overflow-hidden
        before:absolute
        before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_2s_infinite]
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/20
        before:to-transparent
        ${variants[variant] || variants.rect}
        ${className}
      `}
    />
  );
};

export default Skeleton;
