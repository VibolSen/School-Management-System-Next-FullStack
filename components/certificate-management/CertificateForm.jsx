"use client";
import React, { useState, useEffect } from "react";

const CertificateForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    recipient: "",
    course: "",
    issueDate: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipient: initialData.recipient || "",
        course: initialData.course || "",
        issueDate: initialData.issueDate || "",
        expiryDate: initialData.expiryDate || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipient.trim())
      newErrors.recipient = "Recipient is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.issueDate) newErrors.issueDate = "Issue date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-slate-700 mb-1">
                Recipient
              </label>
              <input
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: "" }));
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.recipient
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.recipient && (
                <p className="text-xs text-red-500 mt-1">{errors.recipient}</p>
              )}
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-slate-700 mb-1">
                Course
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.course) setErrors((prev) => ({ ...prev, course: "" }));
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-white ${
                  errors.course
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-xs text-red-500 mt-1">{errors.course}</p>
              )}
            </div>
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.issueDate) setErrors((prev) => ({ ...prev, issueDate: "" }));
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.issueDate
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.issueDate && (
                <p className="text-xs text-red-500 mt-1">{errors.issueDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: "" }));
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.expiryDate
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.expiryDate && (
                <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>
              )}
            </div>


      </div>

      {/* Footer Buttons */}
      <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Saving..." : "Save Certificate"}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;
