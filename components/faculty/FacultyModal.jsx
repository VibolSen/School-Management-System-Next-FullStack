"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function FacultyModal({
  isOpen,
  onClose,
  onSave,
  facultyToEdit,
  isLoading,
  facultyUsers = [],
}) {
  const [name, setName] = useState("");
  const [headId, setHeadId] = useState("");
  const [mounted, setMounted] = useState(false);

  const isEditMode = !!facultyToEdit;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName(facultyToEdit?.name || "");
      setHeadId(facultyToEdit?.headId || "");
    } else {
      setName("");
      setHeadId("");
    }
  }, [isOpen, facultyToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, headId });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto animate-fade-in-scale">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Faculty" : "Add New Faculty"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 gap-4">
            {/* Faculty Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Faculty Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Director / Head */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Director (Faculty User)
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={headId}
                onChange={(e) => setHeadId(e.target.value)}
                disabled={isLoading}
                required={!isEditMode}
              >
                <option value="">Select Director</option>
                {facultyUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isEditMode ? "Save Changes" : "Save Faculty"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
