
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";

export default function EditExamView({ exam, loggedInUser }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: exam.title || "",
    description: exam.description || "",
    examDate: exam.examDate ? new Date(exam.examDate).toISOString().split('T')[0] : "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [error, setError] = useState("");

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Exam title is required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/teacher/exams/${exam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update exam");
      }

      showMessage("Exam updated successfully!");
      router.push("/teacher/exam");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">Edit Exam</h1>
      <div className="bg-white rounded-xl shadow-2xl w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Midterm Exam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Instructions for the exam..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Exam Date
              </label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/teacher/exam")}
              disabled={isLoading}
              className="px-4 py-2 bg-white border rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
