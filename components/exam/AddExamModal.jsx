"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Calendar, Users, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AddExamModal({
  isOpen,
  onClose,
  onSave,
  teacherGroups,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    examDate: "",
    groupId: "",
  });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        examDate: "",
        groupId: teacherGroups.length > 0 ? teacherGroups[0].id : "",
      });
      setError("");
    }
  }, [isOpen, teacherGroups]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Exam title is required.");
      return;
    }
    if (!formData.groupId) {
      setError("You must select a group for this exam.");
      return;
    }
    onSave(formData);
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">New Examination</h2>
                    <p className="text-xs text-slate-500">Configure a new assessment for your students</p>
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
                  <label className="text-xs font-semibold text-slate-700 ml-1">Exam Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all duration-200 ${
                      error && !formData.title.trim()
                        ? "border-red-500 ring-4 ring-red-500/10"
                        : "border-slate-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white"
                    }`}
                    placeholder="e.g., Spring Midterm 2024"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Instructions / Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 placeholder-slate-400 resize-none hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white"
                    placeholder="Provide exam details, duration, etc..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-400" /> Exam Date
                    </label>
                    <input
                      type="date"
                      name="examDate"
                      value={formData.examDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1 flex items-center">
                      <Users className="w-3 h-3 mr-1 text-slate-400" /> Target Group
                    </label>
                    <div className="relative group">
                      <select
                        name="groupId"
                        value={formData.groupId}
                        onChange={handleChange}
                        className={`w-full pl-3 pr-8 py-2 bg-slate-50 border rounded-xl text-sm transition-all duration-200 appearance-none hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white ${
                          error && !formData.groupId ? "border-red-500" : "border-slate-200"
                        }`}
                        disabled={teacherGroups.length === 0}
                      >
                        {teacherGroups.length === 0 ? (
                          <option value="">No Groups</option>
                        ) : (
                          <>
                            <option value="">Select Category</option>
                            {teacherGroups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">{error}</span>
                  </motion.div>
                )}
              </div>

              <div className="p-5 bg-slate-50 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Students will see this in their agenda
                </span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="xs" color="white" />
                    ) : (
                      "Schedule Exam"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}