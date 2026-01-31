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
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-[6px]",
    xl: "w-24 h-24 border-[8px]",
  };

  const colorClasses = {
    blue: "border-blue-500/10 border-t-blue-600",
    indigo: "border-indigo-500/10 border-t-indigo-600",
    white: "border-white/10 border-t-white",
    gray: "border-gray-200/20 border-t-gray-400",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Pulse Glow */}
      <div
        className={`absolute rounded-full animate-pulse opacity-20 ${spinnerSize} ${
          color === "white" ? "bg-white" : "bg-blue-400"
        } blur-md`}
      />
      
      {/* Middle Decorative Ring */}
      <div
        className={`absolute rounded-full border-2 border-dotted opacity-20 animate-[spin_4s_linear_infinite] ${spinnerSize} ${
          color === "white" ? "border-white" : "border-blue-300"
        }`}
      />

      {/* Main Core Spinner */}
      <div
        className={`rounded-full animate-spin ${spinnerSize} ${spinnerColor} border-solid`}
      />
      
      {/* Inner Highlight */}
      <div className={`absolute w-1/3 h-1/3 rounded-full ${color === 'white' ? 'bg-white/10' : 'bg-blue-400/10'} blur-[2px]`} />
    </div>
  );
};

export default LoadingSpinner;
