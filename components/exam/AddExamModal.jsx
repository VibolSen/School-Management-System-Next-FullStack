// FILE: AddExamModal.jsx
"use client";

import React, { useState, useEffect } from "react";
// 1. IMPORT THE HOOK TO GET THE CURRENTLY LOGGED-IN USER
import { useUser } from "@/context/UserContext"; // Assumes you have a UserContext

const initialFormState = {
  title: "",
  description: "",
  examDate: "",
  startTime: "09:00",
  duration: 60,
  courseId: "",
};

export default function AddExamModal({
  isOpen,
  onClose,
  courses = [],
  examToEdit,
  onExamAdded,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const isEditMode = !!examToEdit;

  // 2. GET THE LOGGED-IN USER FROM THE CONTEXT
  const { user } = useUser();

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && examToEdit) {
      // (Logic for editing an exam would go here)
    } else {
      setFormData({
        ...initialFormState,
        courseId: courses.length > 0 ? courses[0].id : "",
      });
    }
  }, [isOpen, isEditMode, examToEdit, courses]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 3. DYNAMIC VALIDATION ---
    // Make sure a user is logged in before trying to create an exam.
    if (!user || !user.id) {
      alert(
        "You must be logged in to create an exam. Please refresh and try again."
      );
      return;
    }

    const startDate = new Date(`${formData.examDate}T${formData.startTime}`);
    if (isNaN(startDate.getTime())) {
      alert("The selected date or time is invalid.");
      return;
    }

    // --- 4. DYNAMIC PAYLOAD ---
    // The hardcoded instructorId is removed.
    // We now use the ID from the logged-in user.
    const payload = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      courseId: formData.courseId,
      startDate: startDate.toISOString(),
      instructorId: user.id, // Use the real ID from the user context
    };

    try {
      const res = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add exam");
      }

      alert("Exam scheduled successfully!");
      onClose();

      if (onExamAdded) {
        onExamAdded();
      }
    } catch (err) {
      console.error("Add Exam Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  // The JSX for the modal form remains the same
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto relative">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? "Edit Exam" : "Schedule New Exam"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
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

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Exam Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Exam Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                required
              />
            </div>
            {/* Course Dropdown */}
            <div>
              <label
                htmlFor="courseId"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Course
              </label>
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                required
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            {/* Date, Time, Duration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="examDate"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="examDate"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  required
                  min="1"
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Description / Instructions
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              ></textarea>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isEditMode ? "Save Changes" : "Schedule Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
