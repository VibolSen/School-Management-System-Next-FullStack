"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function JobPostingForm({
  isOpen,
  onClose,
  onSaveSuccess,
  initialData,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "", // Comma-separated string
    responsibilities: "", // Comma-separated string
    location: "",
    department: "",
    salaryRange: "",
    employmentType: "Full-time",
    applicationDeadline: "",
    status: "OPEN",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        requirements: initialData.requirements.join(", ") || "",
        responsibilities: initialData.responsibilities.join(", ") || "",
        location: initialData.location || "",
        department: initialData.department || "",
        salaryRange: initialData.salaryRange || "",
        employmentType: initialData.employmentType || "Full-time",
        applicationDeadline: initialData.applicationDeadline
          ? new Date(initialData.applicationDeadline).toISOString().split("T")[0]
          : "",
        status: initialData.status || "OPEN",
      });
    } else if (isOpen && !initialData) {
      // Reset form for new job posting
      setFormData({
        title: "",
        description: "",
        requirements: "",
        responsibilities: "",
        location: "",
        department: "",
        salaryRange: "",
        employmentType: "Full-time",
        applicationDeadline: "",
        status: "OPEN",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(",").map((req) => req.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split(",").map((res) => res.trim()).filter(Boolean),
      };

      const url = initialData
        ? `/api/admin/job-postings/${initialData.id}`
        : "/api/admin/job-postings";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save job posting");
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? "Edit Job Posting" : "Create New Job Posting"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="requirements">Requirements <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="requirements"
                id="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="e.g., Degree in CS, 3+ years experience, good communication"
                required
                className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas.</p>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="responsibilities">Responsibilities <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="responsibilities"
                id="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="e.g., Develop new features, Collaborate with team, Write documentation"
                required
                className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple responsibilities with commas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="location">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Department (Optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="department">Department</label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salary Range (Optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="salaryRange">Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  id="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g., $50,000 - $70,000"
                  className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="employmentType">Employment Type <span className="text-red-500">*</span></label>
                <select
                  name="employmentType"
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="applicationDeadline">Application Deadline <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="applicationDeadline"
                id="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status (for editing) */}
            {initialData && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                  <option value="FILLED">Filled</option>
                </select>
              </div>
            )}
          </div>
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="xs" color="white" />
                  <span>Saving...</span>
                </div>
              ) : initialData ? "Update Job Posting" : "Create Job Posting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}