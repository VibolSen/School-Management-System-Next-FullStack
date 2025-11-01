"use client";
import React, { useState, useEffect } from 'react';

const CertificateForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    recipient: initialData.recipient || '',
    course: initialData.course || '',
    issueDate: initialData.issueDate || '',
    expiryDate: initialData.expiryDate || '',
    uniqueId: initialData.uniqueId || '',
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
        <input
          type="text"
          name="recipient"
          id="recipient"
          value={formData.recipient}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
        <select
          name="course"
          id="course"
          value={formData.course}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
        <input
          type="date"
          name="issueDate"
          id="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          id="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700">Unique ID</label>
        <input
          type="text"
          name="uniqueId"
          id="uniqueId"
          value={formData.uniqueId}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save Certificate
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;
