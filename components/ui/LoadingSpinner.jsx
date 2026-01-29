"use client";

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * A premium, unified loading spinner for the application.
 * Features a multi-layered animation and smooth transitions.
 */
const LoadingSpinner = ({ size = "md", color = "blue", className = "" }) => {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-[6px]",
    xl: "w-24 h-24 border-[8px]",
  };

  const colorClasses = {
    blue: "border-blue-500/20 border-t-blue-600",
    indigo: "border-indigo-500/20 border-t-indigo-600",
    white: "border-white/20 border-t-white",
    gray: "border-gray-300/20 border-t-gray-500",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Ring - Pulsing */}
      <div
        className={`absolute rounded-full animate-pulse opacity-20 ${spinnerSize} ${
          color === "white" ? "bg-white" : "bg-blue-500"
        }`}
      />
      
      {/* Middle Ring - Slow Rotation */}
      <div
        className={`absolute rounded-full border-dashed border-2 opacity-30 animate-[spin_3s_linear_infinite] ${spinnerSize} ${
          color === "white" ? "border-white" : "border-blue-400"
        }`}
      />

      {/* Main Spinner - Fast Rotation */}
      <div
        className={`rounded-full animate-spin ${spinnerSize} ${spinnerColor} border-solid`}
      />
      
      {/* Subtle Inner Glow */}
      <div className="absolute w-1/4 h-1/4 rounded-full bg-white/10 blur-[1px]" />
    </div>
  );
};

export default LoadingSpinner;
