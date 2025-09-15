"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  type = "danger", // 'danger', 'warning', or 'success'
}) {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Small delay to allow for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Configuration based on dialog type
  const config = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6" />,
      confirmButton: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
      iconContainer: "bg-red-100 text-red-600",
      accent: "red",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      confirmButton: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500",
      iconContainer: "bg-amber-100 text-amber-600",
      accent: "amber",
    },
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      confirmButton:
        "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500",
      iconContainer: "bg-emerald-100 text-emerald-600",
      accent: "emerald",
    },
  };

  const currentConfig = config[type];

  const dialogContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-modal="true"
      role="dialog"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } border border-slate-200/60`}
      >
        {/* Header with icon */}
        <div className="relative p-6 pb-4">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors duration-200"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>

          {/* Icon container */}
          <div className={`flex justify-center mb-4`}>
            <div
              className={`p-4 rounded-full ${currentConfig.iconContainer} relative`}
            >
              {currentConfig.icon}

              {/* Animated ring */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-${currentConfig.accent}-200 animate-ping opacity-60`}
              ></div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-slate-800">
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <p className="text-slate-600 text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action buttons */}
        <div className="bg-slate-50/70 px-6 py-4 flex justify-center space-x-3 rounded-b-2xl border-t border-slate-200/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 hover:shadow-sm disabled:opacity-50 shadow-sm"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 ${currentConfig.confirmButton} border border-transparent rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg relative overflow-hidden group`}
            disabled={isLoading}
          >
            {/* Shine effect on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

            {/* Loading spinner or text */}
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {type === "danger" && "Delete"}
                {type === "warning" && "Continue"}
                {type === "success" && "Confirm"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (isClient) {
    return createPortal(dialogContent, document.body);
  }

  return null;
}
