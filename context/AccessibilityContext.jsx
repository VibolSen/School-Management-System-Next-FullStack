"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    const savedReducedMotion = localStorage.getItem("reducedMotion") === "true";
    const savedHighContrast = localStorage.getItem("highContrast") === "true";
    const savedScreenReaderOptimized = localStorage.getItem("screenReaderOptimized") === "true";

    setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);
    setHighContrast(savedHighContrast);
    setScreenReaderOptimized(savedScreenReaderOptimized);

    // Apply settings
    applyFontSize(savedFontSize);
    applyReducedMotion(savedReducedMotion);
    applyHighContrast(savedHighContrast);
    applyScreenReaderOptimized(savedScreenReaderOptimized);
  }, []);

  const applyFontSize = (size) => {
    const root = document.documentElement;
    const sizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    };
    root.style.fontSize = sizes[size] || sizes.medium;
  };

  const applyReducedMotion = (enabled) => {
    if (enabled) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  };

  const applyHighContrast = (enabled) => {
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const applyScreenReaderOptimized = (enabled) => {
    if (enabled) {
      document.documentElement.classList.add("screen-reader-optimized");
    } else {
      document.documentElement.classList.remove("screen-reader-optimized");
    }
  };

  const updateFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem("reducedMotion", newValue.toString());
    applyReducedMotion(newValue);
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("highContrast", newValue.toString());
    applyHighContrast(newValue);
  };

  const toggleScreenReaderOptimized = () => {
    const newValue = !screenReaderOptimized;
    setScreenReaderOptimized(newValue);
    localStorage.setItem("screenReaderOptimized", newValue.toString());
    applyScreenReaderOptimized(newValue);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        updateFontSize,
        reducedMotion,
        toggleReducedMotion,
        highContrast,
        toggleHighContrast,
        screenReaderOptimized,
        toggleScreenReaderOptimized,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
