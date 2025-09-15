"use client";

import React, { useState, useEffect } from "react";

export default function GroupModal({
  isOpen,
  onClose,
  onSave,
  groupToEdit,
  courses,
  isLoading,
}) {
  // ✅ MODIFIED: Form state now includes courseId
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (groupToEdit) {
        setFormData({
          name: groupToEdit.name || "",
          courseId: groupToEdit.courseId || "",
        });
      } else {
        setFormData({
          name: "",
          courseId: courses.length > 0 ? courses[0].id : "",
        });
      }
      setError("");
    }
  }, [isOpen, groupToEdit, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Group name cannot be empty.");
      return;
    }
    if (!formData.courseId) {
      setError("You must select a course.");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {groupToEdit ? "Edit Group" : "Add New Group"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-800"
          >
            {/* Close Icon SVG */}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Group Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* ✅ ADDED: Course Selector Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white"
                disabled={courses.length === 0}
              >
                {courses.length === 0 ? (
                  <option>Please create a course first</option>
                ) : (
                  <>
                    <option value="">Select a Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="..."
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="...">
              {isLoading ? "Saving..." : "Save Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
