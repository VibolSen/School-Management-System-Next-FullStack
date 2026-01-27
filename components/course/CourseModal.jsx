"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, Building2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      {isEditMode ? "Modify Course" : "Create New Course"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isEditMode ? "Update course syllabus and metadata" : "Define a new academic course for students"}
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 ring-4 ring-red-500/10"
                        : "border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    }`}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                  {errors.name && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Department Associations
                  </label>
                  <div className={`p-3 space-y-2.5 bg-slate-50 border rounded-xl max-h-40 overflow-y-auto transition-all duration-200 ${
                    errors.departmentIds ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-200"
                  }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {departments.map((dept) => (
                        <label key={dept.id} className="flex items-center group cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.departmentIds.includes(dept.id)}
                              onChange={() => handleDepartmentChange(dept.id)}
                              className="peer h-4 w-4 bg-white border-slate-300 rounded text-blue-600 focus:ring-blue-500 transition-all duration-200"
                            />
                            <div className="ml-2.5 text-xs text-slate-600 group-hover:text-slate-900 transition-colors">
                              {dept.name}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  {errors.departmentIds && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 ml-1">
                      {errors.departmentIds}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">
                    Lead Instructor (Optional)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <select
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 appearance-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    >
                      <option value="">Select an instructor</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {`${teacher.firstName} ${teacher.lastName}`}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? "Saving..." : isEditMode ? "Update Course" : "Register Course"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render modal inside <body> to escape layout restrictions
  return createPortal(modalContent, document.body);
}
