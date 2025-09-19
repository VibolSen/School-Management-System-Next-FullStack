"use client";

import React, { useState, useEffect } from "react";

export default function DepartmentModal({
  isOpen,
  onClose,
  onSave,
  departmentToEdit,
  isLoading = false,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isEditMode = !!departmentToEdit;

  useEffect(() => {
    if (isOpen) {
      setName(departmentToEdit?.name || "");
      setError("");
    }
  }, [isOpen, departmentToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Department name cannot be empty.");
      return;
    }
    onSave({ name });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-scale">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2
              id="department-modal-title"
              className="text-xl font-bold text-slate-800"
            >
              {isEditMode ? "Edit Department" : "Add New Department"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
              aria-label="Close modal"
              disabled={isLoading}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                error
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-slate-300"
              }`}
              placeholder="e.g., Computer Science"
              required
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Save Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
