// Notification.jsx
"use client";

import React from "react";

// --- Configuration for Icons and Styles ---

// We define SVG icons here for easy reference
const ICONS = {
  success: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ),
  error: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ),
  // You can easily add more types like 'info' or 'warning'
  info: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ),
};

// We define style mappings to keep the JSX clean
const STYLES = {
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    icon: "text-green-500",
    progress: "bg-green-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    icon: "text-red-500",
    progress: "bg-red-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "text-blue-500",
    progress: "bg-blue-500",
  },
};

export default function Notification({
  show,
  message,
  type = "info",
  onClose,
}) {
  if (!show) {
    return null;
  }

  // Select the style and icon based on the 'type' prop, defaulting to 'info'
  const style = STYLES[type] || STYLES.info;
  const icon = ICONS[type] || ICONS.info;

  return (
    <div
      className="fixed top-5 right-5 z-50 w-full max-w-sm animate-fancy-slide-in"
      role="alert"
    >
      <div
        className={`relative flex items-start p-4 border-l-4 rounded-md shadow-lg overflow-hidden ${style.bg} ${style.border}`}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${style.icon}`}>{icon}</div>

        {/* Message */}
        <div className="ml-3">
          <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 ${style.text} hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400`}
        >
          <span className="sr-only">Dismiss</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-black bg-opacity-10 w-full">
          <div
            className={`h-full ${style.progress} animate-progress-bar`}
            // This duration should match the timeout in UserManagementView.jsx (3000ms = 3s)
            style={{ animationDuration: "3s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
