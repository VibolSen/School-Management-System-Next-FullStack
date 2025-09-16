"use client";

import React, { useState, useEffect } from "react";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function AddTeacherModal({
  isOpen,
  onClose,
  onSaveTeacher,
  teacherToEdit,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEditMode = !!teacherToEdit;

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) {
        setFormData({
          firstName: teacherToEdit.firstName || "",
          lastName: teacherToEdit.lastName || "",
          email: teacherToEdit.email || "",
          password: "", // Always clear password for edits
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, teacherToEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required.";
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
    if (isEditMode && !dataToSend.password) delete dataToSend.password;
    onSaveTeacher(dataToSend);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Teacher" : "Add New Teacher"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 ..."
            >
              &times;
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm ...">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full ... ${
                  errors.firstName ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-xs ...">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm ...">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full ... ${
                  errors.lastName ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-xs ...">{errors.lastName}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm ...">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full ... ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.email && <p className="text-xs ...">{errors.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm ...">
                Password {isEditMode ? "(Optional)" : "*"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full ... ${
                  errors.password ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.password && (
                <p className="text-xs ...">{errors.password}</p>
              )}
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button type="button" onClick={onClose} className="...">
              Cancel
            </button>
            <button type="submit" className="...">
              {isEditMode ? "Save Changes" : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
