"use client";

import React, { useState, useEffect } from "react";

export default function AddStaffModal({
  isOpen,
  onClose,
  onSave,
  staffToEdit,
  roles,
  isLoading = false,
}) {
  // ✅ MODIFIED: State updated for the new schema
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        setFormData({
          firstName: staffToEdit.firstName || "",
          lastName: staffToEdit.lastName || "",
          email: staffToEdit.email || "",
          role: staffToEdit.role || roles?.[0] || "",
          password: "",
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: roles?.[0] || "",
          password: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, staffToEdit, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!staffToEdit && (!formData.password || formData.password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = { ...formData };
      if (staffToEdit && !dataToSend.password) delete dataToSend.password;
      onSave(dataToSend);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {staffToEdit ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-800"
          >
            {/* Close Icon SVG */}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* ✅ MODIFIED: Split name into two fields */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Jane"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full ... ${
                errors.firstName ? "border-red-500" : "border-slate-300"
              }`}
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Smith"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full ... ${
                errors.lastName ? "border-red-500" : "border-slate-300"
              }`}
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="staff@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full ... ${
                errors.email ? "border-red-500" : "border-slate-300"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full ... ${
                errors.role ? "border-red-500" : "border-slate-300"
              }`}
              required
            >
              <option value="">Select Role</option>
              {(roles || []).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password {staffToEdit ? "(Optional)" : "*"}
            </label>
            <input
              type="password"
              name="password"
              placeholder={
                staffToEdit
                  ? "Leave blank to keep unchanged"
                  : "Min. 6 characters"
              }
              value={formData.password}
              onChange={handleChange}
              className={`w-full ... ${
                errors.password ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          {/* ✅ REMOVED: Status field is gone */}
          <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="..."
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="...">
              {isLoading
                ? "Saving..."
                : staffToEdit
                ? "Update Staff"
                : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
