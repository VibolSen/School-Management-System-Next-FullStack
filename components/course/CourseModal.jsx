"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
    departmentIds: [],
    teacherId: "",
  });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const isEditMode = !!courseToEdit;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setFormData({
          name: courseToEdit.name || "",
          departmentIds:
            courseToEdit.courseDepartments?.map((cd) => cd.departmentId) || [],
          teacherId: courseToEdit.teacherId || "",
        });
      } else {
        setFormData({
          name: "",
          departmentIds: [],
          teacherId: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, courseToEdit, departments]);

  const handleDepartmentChange = (departmentId) => {
    setFormData((prev) => {
      const departmentIds = prev.departmentIds.includes(departmentId)
        ? prev.departmentIds.filter((id) => id !== departmentId)
        : [...prev.departmentIds, departmentId];
      return { ...prev, departmentIds };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Course name is required.";
    if (!formData.departmentIds || formData.departmentIds.length === 0)
      newErrors.departmentIds = "At least one department is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Course Details" : "Add New Course"}
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
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.name
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department
              </label>
              <div className="grid grid-cols-2 gap-2 p-2 border rounded-md bg-white h-32 overflow-y-auto">
                {departments.map((dept) => (
                  <label key={dept.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.departmentIds.includes(dept.id)}
                      onChange={() => handleDepartmentChange(dept.id)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm">{dept.name}</span>
                  </label>
                ))}
              </div>
              {errors.departmentIds && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.departmentIds}
                </p>
              )}
            </div>

            {/* Lead Teacher */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lead Teacher (Optional)
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">assigned to</option>
                {teachers.map((teacher) => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >{`${teacher.firstName} ${teacher.lastName}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
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
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render modal inside <body> to escape layout restrictions
  return createPortal(modalContent, document.body);
}
