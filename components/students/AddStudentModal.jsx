"use client";

import React, { useState, useEffect } from "react";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function AddStudentModal({
  isOpen,
  onClose,
  onSaveStudent,
  studentToEdit,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const isEditMode = !!studentToEdit;

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        setFormData({
          firstName: studentToEdit.firstName || "",
          lastName: studentToEdit.lastName || "",
          email: studentToEdit.email || "",
          password: "",
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, studentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required.";
    }
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSend = { ...formData };
    if (isEditMode && !dataToSend.password) {
      delete dataToSend.password;
    }
    onSaveStudent(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2
              id="add-student-modal-title"
              className="text-xl font-bold text-slate-800"
            >
              {isEditMode ? "Edit Student Details" : "Add New Student"}
            </h2>
            <button
              onClick={onClose}
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
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.firstName
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.lastName
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
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
                  errors.email
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password {isEditMode ? "(Optional)" : ""}
              </label>
              <input
                type="password"
                name="password"
                placeholder={
                  isEditMode
                    ? "Leave blank to keep current password"
                    : "Minimum 6 characters"
                }
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.password
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditMode ? "Save Changes" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
