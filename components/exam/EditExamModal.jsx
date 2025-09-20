
"use client";

import React, { useState, useEffect } from "react";

export default function EditExamModal({
  isOpen,
  onClose,
  onSave,
  exam,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    examDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && exam) {
      setFormData({
        title: exam.title,
        description: exam.description || "",
        examDate: exam.examDate ? new Date(exam.examDate).toISOString().split('T')[0] : "",
      });
      setError("");
    }
  }, [isOpen, exam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Exam title is required.");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Edit Exam</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Exam Date
              </label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white border rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
