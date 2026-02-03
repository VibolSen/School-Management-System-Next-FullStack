"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, X, GraduationCap, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function TeacherModal({
  isOpen,
  onClose,
  onSaveTeacher,
  teacherToEdit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false); // To handle createPortal
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = !!teacherToEdit;

  useEffect(() => {
    setMounted(true); // For createPortal
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) {
        setFormData({
          firstName: teacherToEdit.firstName || "",
          lastName: teacherToEdit.lastName || "",
          email: teacherToEdit.email || "",
          password: "", // Password not pre-filled for security
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, teacherToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name must contain only letters";
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name must contain only letters";
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required";
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
      onSaveTeacher(dataToSend);
    }
  };

  if (!isOpen || !mounted) return null; // Use mounted state for createPortal

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-full overflow-hidden flex flex-col border border-white/20"
          >
            <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 id="add-teacher-modal-title" className="text-lg font-bold text-slate-800">
                      {isEditMode ? "Edit Teacher Account" : "Register New Teacher"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isEditMode ? "Update faculty member information" : "Add a new educator to the platform"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                        errors.firstName
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                      }`}
                    />
                    {errors.firstName && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                        {errors.firstName}
                      </motion.p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                        errors.lastName
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                      }`}
                    />
                    {errors.lastName && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                        {errors.lastName}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                        errors.email
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Password {isEditMode ? "(Optional)" : ""}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={isEditMode ? "Leave blank to keep current" : "Minimum 6 characters"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 ring-4 ring-red-500/10"
                          : "border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
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
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? "Saving..." : isEditMode ? "Update Changes" : "Register Teacher"}
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