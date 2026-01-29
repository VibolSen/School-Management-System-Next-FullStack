"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, X, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "", // Added role to initial form state
};

export default function StaffModal({
  isOpen,
  onClose,
  onSave,
  staffToEdit,
  roles,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false); // To handle createPortal
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = !!staffToEdit;

  useEffect(() => {
    setMounted(true); // For createPortal
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        setFormData({
          firstName: staffToEdit.firstName || "",
          lastName: staffToEdit.lastName || "",
          email: staffToEdit.email || "",
          role: staffToEdit.role || roles?.[0] || "",
          password: "", // Password not pre-filled for security
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: roles?.[0] || "",
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
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = { ...formData };
      if (isEditMode && !dataToSend.password) {
        delete dataToSend.password; // Don't send empty password on edit
      }
      onSave(dataToSend);
    }
  };

  if (!isOpen || !mounted) return null; // Use mounted state for createPortal

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
          {/* Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-full overflow-hidden flex flex-col border border-white/20"
          >
            {/* Header with Gradient Background */}
            <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 id="add-staff-modal-title" className="text-lg font-bold text-slate-800">
                      {isEditMode ? "Edit Staff Profile" : "Add New Staff"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isEditMode ? "Modify staff account details" : "Register a new staff member to the system"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">
                      First Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-3 pr-3 py-2 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                          errors.firstName
                            ? "border-red-500 ring-4 ring-red-500/10"
                            : "border-slate-200 group-hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                        {errors.firstName}
                      </motion.p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">
                      Last Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-3 pr-3 py-2 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                          errors.lastName
                            ? "border-red-500 ring-4 ring-red-500/10"
                            : "border-slate-200 group-hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                        {errors.lastName}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@school.com"
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                        errors.email
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 group-hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Staff Role
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 appearance-none ${
                        errors.role
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 group-hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                      }`}
                    >
                      <option value="" disabled>Select Staff Role</option>
                      {(roles || []).filter((role) => role !== "ADMIN").map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.role && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                      {errors.role}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Password {isEditMode ? "(Optional)" : ""}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={isEditMode ? "Leave empty to keep current" : "Minimum 6 characters"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 group-hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 bg-slate-50 border-t flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative overflow-hidden px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="xs" color="white" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <span>{isEditMode ? "Update Profile" : "Register Staff"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}