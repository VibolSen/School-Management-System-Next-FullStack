"use client";

import React, { useState, useEffect } from "react";

export default function CourseModal({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
  departments,
  teachers,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    teacherId: "", // Teacher is optional, so it can be an empty string
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        // Populate form for editing
        setFormData({
          name: courseToEdit.name || "",
          departmentId: courseToEdit.departmentId || "",
          teacherId: courseToEdit.teacherId || "",
        });
      } else {
        // Reset form for adding a new course
        setFormData({
          name: "",
          departmentId: departments.length > 0 ? departments[0].id : "",
          teacherId: "",
        });
      }
      setError("");
    }
  }, [isOpen, courseToEdit, departments, teachers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Course name cannot be empty.");
      return;
    }
    if (!formData.departmentId) {
      setError("You must select a department.");
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
            {courseToEdit ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
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
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Course Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300"
                placeholder="e.g., Introduction to Computer Science"
              />
            </div>

            {/* Department Selector Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department *
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white border-slate-300"
                disabled={departments.length === 0}
              >
                {departments.length === 0 ? (
                  <option>Please create a department first</option>
                ) : (
                  <>
                    <option value="">Select a Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Lead Teacher Selector Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lead Teacher (Optional)
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white border-slate-300"
              >
                <option value="">-- Unassigned --</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
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
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
