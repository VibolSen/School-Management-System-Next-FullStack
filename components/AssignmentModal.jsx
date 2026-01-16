"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  teacherGroups,
  isLoading,
  assignment, // This is the key change: pass the assignment to edit
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    groupId: "",
    points: "",
    attachments: [],
  });
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isEditMode = Boolean(assignment);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      console.log("AssignmentModal: teacherGroups prop", teacherGroups);
      if (isEditMode) {
        // Populate form with existing assignment data
        setFormData({
          title: assignment.title,
          description: assignment.description || "",
          dueDate: assignment.dueDate
            ? new Date(assignment.dueDate).toISOString().split("T")[0]
            : "",
          groupId: assignment.groupId,
          points: assignment.points || "",
          attachments: assignment.attachments || [],
        });
      } else {
        // Reset form for creating a new assignment
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          groupId: teacherGroups.length > 0 ? teacherGroups[0].id : "",
          points: "",
          attachments: [],
        });
      }
      setError("");
    }
  }, [isOpen, isEditMode, assignment, teacherGroups]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Assignment title is required.");
      return;
    }
    if (!isEditMode && !formData.groupId) {
      setError("You must select a group for this assignment.");
      return;
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      setError("Due date cannot be in the past.");
      return;
    }

    onSave(formData);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-xl transform ${
          isClosing ? "animate-scaleOut" : "animate-scaleIn"
        }`}
      >
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25"></div>

        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEditMode ? "Edit Assignment" : "Create New Assignment"}
                  </h2>
                  <p className="text-blue-100 text-xs mt-0.5">
                    {isEditMode
                      ? "Update the details for your assignment"
                      : "Fill in the details for your new assignment"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-all duration-200 disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Title Input */}
                <div className="group">
                  <label className="flex items-center text-xs font-semibold text-slate-700 mb-2">
                    <svg
                      className="w-3 h-3 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 placeholder-slate-400 text-sm"
                    placeholder="e.g., Chapter 5 Review Quiz"
                    disabled={isLoading}
                  />
                </div>

                {/* Description Input */}
                <div className="group">
                  <label className="flex items-center text-xs font-semibold text-slate-700 mb-2">
                    <svg
                      className="w-3 h-3 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 placeholder-slate-400 resize-none text-sm"
                    placeholder="Provide detailed instructions for your students..."
                    disabled={isLoading}
                  ></textarea>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Due Date */}
                  <div className="group">
                    <label className="flex items-center text-xs font-semibold text-slate-700 mb-2">
                      <svg
                        className="w-3 h-3 mr-1 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Points */}
                  <div className="group">
                    <label className="flex items-center text-xs font-semibold text-slate-700 mb-2">
                      <svg
                        className="w-3 h-3 mr-1 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Points
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={formData.points}
                      onChange={handleChange}
                      min="0"
                      max="1000"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
                      placeholder="100"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Group Selection */}
                  <div className="group">
                    <label className="flex items-center text-xs font-semibold text-slate-700 mb-2">
                      <svg
                        className="w-3 h-3 mr-1 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Assign to Group *
                    </label>
                    <select
                      name="groupId"
                      value={formData.groupId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 bg-white appearance-none text-sm"
                      disabled={isEditMode || teacherGroups.length === 0 || isLoading}
                    >
                      {teacherGroups.length === 0 ? (
                        <option value="">
                          You have no groups to assign to
                        </option>
                      ) : (
                        teacherGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg
                      className="w-4 h-4 text-red-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-red-600 font-normal text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-slate-500">
                Fields marked with * are required
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-normal hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 flex items-center space-x-1"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-normal shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span>{isEditMode ? "Saving..." : "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{isEditMode ? "Save Changes" : "Create Assignment"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scaleOut {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.9);
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-scaleOut {
          animation: scaleOut 0.3s ease-out;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}