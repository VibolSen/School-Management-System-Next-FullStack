"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import StatusMessage from "@/components/StatusMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
            {initialData ? "Edit Job Posting" : "Create New Job Posting"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {statusMessage && (
          <div className="mb-4">
            <StatusMessage type={statusMessage.type} message={statusMessage.message} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            ></Textarea>
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements">Requirements <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="requirements"
              id="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g., Degree in CS, 3+ years experience, good communication"
              required
            />
             <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas.</p>
          </div>

          {/* Responsibilities */}
          <div>
            <Label htmlFor="responsibilities">Responsibilities <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="responsibilities"
              id="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="e.g., Develop new features, Collaborate with team, Write documentation"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple responsibilities with commas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department (Optional) */}
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Salary Range (Optional) */}
            <div>
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                type="text"
                name="salaryRange"
                id="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>

            {/* Employment Type */}
            <div>
              <Label htmlFor="employmentType">Employment Type <span className="text-red-500">*</span></Label>
              <select
                name="employmentType"
                id="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
            <Label htmlFor="applicationDeadline">Application Deadline <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              name="applicationDeadline"
              id="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status (for editing) */}
          {initialData && (
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="FILLED">Filled</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? "Update Job Posting" : "Create Job Posting"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
