"use client";

import React, { useState, useEffect } from "react";
import CourseSelector from "@/components/departments/CourseSelector" // Assuming a reusable course selector exists

const initialFormState = {
  name: "",
  email: "",
  hireDate: "",
  password: "",
  isActive: true,
  roleId: "",
  courseIds: [],
};

export default function AddTeacherModal({
  isOpen,
  onClose,
  onSaveTeacher,
  teacherToEdit,
  allCourses = [],
  allRoles = [],
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEditMode = !!teacherToEdit;

  // Filter for roles named "teacher" or "faculty" to show in the dropdown.
  const teacherRoles = allRoles.filter((r) =>
    ["teacher", "faculty"].includes(r.name?.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) {
        setFormData({
          name: teacherToEdit.name || "",
          email: teacherToEdit.email || "",
          hireDate: teacherToEdit.hireDate
            ? new Date(teacherToEdit.hireDate).toISOString().split("T")[0]
            : "",
          password: "",
          isActive: teacherToEdit.isActive ?? true,
          roleId: teacherToEdit.roleId || "",
          courseIds: teacherToEdit.courses?.map((c) => c.id) || [],
        });
      } else {
        // When adding a new teacher, find the specific "Teacher" role.
        const defaultTeacherRole =
          teacherRoles.find((r) => r.name?.toLowerCase() === "teacher") ||
          teacherRoles[0];
        setFormData({
          ...initialFormState,
          roleId: defaultTeacherRole?.id || "", // Set default roleId
        });
      }
      setErrors({});
    }
  }, [isOpen, teacherToEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid.";
    if (!isEditMode && !formData.password)
      newErrors.password = "Password is required for new teachers.";
    if (!formData.roleId) newErrors.roleId = "A role must be selected.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSaveTeacher(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Teacher" : "Add New Teacher"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-full"
            >
              &times;
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.name ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            {!isEditMode && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.password ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-white ${
                  errors.roleId ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select a Role</option>
                {teacherRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-xs text-red-500 mt-1">{errors.roleId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hire Date
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-slate-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assign Courses
              </label>
              <CourseSelector
                allCourses={allCourses}
                selectedCourseIds={formData.courseIds}
                setSelectedCourseIds={(ids) =>
                  setFormData((prev) => ({ ...prev, courseIds: ids }))
                }
              />
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border rounded-md text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold"
            >
              {isEditMode ? "Save Changes" : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
