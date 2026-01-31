"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { motion } from "framer-motion";

/**
 * A unique Signature Transition: Multi-Panel Geometric Shutter.
 * High-end, staggered wipe animation for a premium brand experience.
 */
const FullPageLoading = ({ message = "Loading Management System..." }) => {
  // Brand colors for the shutter panels
  const panels = [
    { color: "bg-blue-600", delay: 0 },
    { color: "bg-blue-800", delay: 0.1 },
    { color: "bg-indigo-900", delay: 0.2 },
  ];

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden flex items-center justify-center pointer-events-none">
      {/* Animated shutter panels */}
      <div className="absolute inset-x-0 inset-y-0 flex flex-col md:flex-row pointer-events-auto">
        {panels.map((panel, idx) => (
          <motion.div
            key={idx}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.77, 0, 0.175, 1],
              delay: panel.delay,
            }}
            style={{ originY: 0 }}
            className={`flex-1 h-full w-full ${panel.color} shadow-2xl`}
          />
        ))}
      </div>

      {/* Content overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="relative z-[10001] flex flex-col items-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] pointer-events-auto"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <LoadingSpinner size="lg" color="white" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
            {message}
          </h2>
          <div className="mt-4 flex justify-center gap-1.5">
            {[0, 0.1, 0.2].map((d) => (
              <motion.span
                key={d}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1, delay: d }}
                className="w-2 h-2 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FullPageLoading;
