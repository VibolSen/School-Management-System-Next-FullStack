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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="recipient" className="text-right text-sm font-medium">
          Recipient
        </label>
        <input
          id="recipient"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          className="col-span-3 px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.recipient && (
          <p className="col-span-4 text-xs text-red-500 text-right">
            {errors.recipient}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="course" className="text-right text-sm font-medium">
          Course
        </label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="col-span-3 px-3 py-2 border rounded-md text-sm bg-white border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        {errors.course && (
          <p className="col-span-4 text-xs text-red-500 text-right">
            {errors.course}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="issueDate" className="text-right text-sm font-medium">
          Issue Date
        </label>
        <input
          type="date"
          id="issueDate"
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          className="col-span-3 px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.issueDate && (
          <p className="col-span-4 text-xs text-red-500 text-right">
            {errors.issueDate}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="expiryDate" className="text-right text-sm font-medium">
          Expiry Date
        </label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="col-span-3 px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>



      <div className="flex justify-end space-x-2 pt-4">
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
