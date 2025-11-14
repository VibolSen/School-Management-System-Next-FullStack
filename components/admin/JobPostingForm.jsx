"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import StatusMessage from "@/components/StatusMessage";

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
  const [statusMessage, setStatusMessage] = useState(null);

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
    setStatusMessage(null);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(",").map((req) => req.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split(",").map((res) => res.trim()).filter(Boolean),
      };

      const url = initialData
        ? `/api/admin/job-postings/${initialData.id}` // Changed API endpoint
        : "/api/admin/job-postings"; // Changed API endpoint
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

      setStatusMessage({ type: "success", message: "Job posting saved successfully!" });
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
      setStatusMessage({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 border w-full max-w-2xl md:max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {initialData ? "Edit Job Posting (Admin)" : "Create New Job Posting (Admin)"} {/* Changed title */}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {statusMessage && (
          <div className="mb-4">
            <StatusMessage type={statusMessage.type} message={statusMessage.message} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements (comma-separated)</label>
            <input
              type="text"
              name="requirements"
              id="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">Responsibilities (comma-separated)</label>
            <input
              type="text"
              name="responsibilities"
              id="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Department (Optional) */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department (Optional)</label>
            <input
              type="text"
              name="department"
              id="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Salary Range (Optional) */}
          <div>
            <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">Salary Range (Optional)</label>
            <input
              type="text"
              name="salaryRange"
              id="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
            <select
              name="employmentType"
              id="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Application Deadline */}
          <div>
            <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              id="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Status (for editing) */}
          {initialData && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="FILLED">Filled</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : initialData ? (
                "Update Job Posting (Admin)"
              ) : (
                "Create Job Posting (Admin)"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
