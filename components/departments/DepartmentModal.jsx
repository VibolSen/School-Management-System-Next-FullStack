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

  // This effect runs when the modal opens or the department to edit changes.
  // It populates the form field for editing or clears it for adding.
  useEffect(() => {
    if (isOpen) {
      if (departmentToEdit) {
        setName(departmentToEdit.name); // Pre-fill the name for editing
      } else {
        setName(""); // Clear the name for adding a new one
      }
      setError(""); // Always clear previous validation errors
    }
  }, [isOpen, departmentToEdit]);

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Department name cannot be empty.");
      return;
    }
    onSave({ name });
  };

  // If the modal is not supposed to be open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {departmentToEdit ? "Edit Department" : "Add New Department"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-800"
            aria-label="Close modal"
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="e.g., Computer Science"
              required
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Saving..."
                : departmentToEdit
                ? "Update Department"
                : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
