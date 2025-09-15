"use client";

import React, { useState, useEffect } from "react";

// The initial state for the form, matching the simplified user model.
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

  // A boolean to easily check if we are editing an existing student or adding a new one.
  const isEditMode = !!studentToEdit;

  // This effect runs whenever the modal is opened or a different student is selected for editing.
  // It resets the form to its initial state or populates it with the student's data.
  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        // We are editing: fill the form with the existing student's details.
        // Password is left blank for security; it's only updated if a new one is typed.
        setFormData({
          firstName: studentToEdit.firstName || "",
          lastName: studentToEdit.lastName || "",
          email: studentToEdit.email || "",
          password: "",
        });
      } else {
        // We are adding a new student: reset the form to be empty.
        setFormData(initialFormState);
      }
      // Always clear any previous validation errors when the modal opens.
      setErrors({});
    }
  }, [isOpen, studentToEdit]);

  // A generic function to update the form state as the user types.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for a field as soon as the user starts correcting it.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validates the form fields before submission.
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required.";
    }
    // Password is only required when creating a new student.
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    // The form is valid if the errors object is empty.
    return Object.keys(newErrors).length === 0;
  };

  // Handles the form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails.

    const dataToSend = { ...formData };
    // If we are editing and the password field is empty, remove it from the payload
    // so we don't overwrite the existing password with an empty string.
    if (isEditMode && !dataToSend.password) {
      delete dataToSend.password;
    }
    onSaveStudent(dataToSend); // Send the clean data to the parent component.
  };

  // If the modal isn't open, render nothing.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? "Edit Student Details" : "Add New Student"}
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

        {/* Modal Body with Form */}
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
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.firstName ? "border-red-500" : "border-slate-300"
                }`}
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
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.lastName ? "border-red-500" : "border-slate-300"
                }`}
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
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password {isEditMode ? "(Optional)" : "*"}
              </label>
              <input
                type="password"
                name="password"
                placeholder={
                  isEditMode
                    ? "Leave blank to keep current password"
                    : "Min. 6 characters"
                }
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Modal Footer with Action Buttons */}
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isEditMode ? "Save Changes" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
