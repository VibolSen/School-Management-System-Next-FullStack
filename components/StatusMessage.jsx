"use client";

import React, { useState, useEffect } from 'react';

const StatusMessage = ({ type, message }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (message) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  const baseClasses = "p-4 rounded-md flex justify-between items-center mb-4";
  const typeClasses = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-100 text-gray-800'}`}>
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="font-bold text-xl">&times;</button>
    </div>
  );
};

export default StatusMessage;