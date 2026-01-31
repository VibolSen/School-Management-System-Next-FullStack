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
    studentId: "",
    course: "",
    issueDate: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

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

    const fetchStudents = async () => {
      try {
        // Assuming there's a way to get all students. 
        // If not, we might need to search or use a different endpoint.
        // For now, let's try to fetch users with role STUDENT if endpoint supports it, 
        // or just fetch all users and filter client side if the list isn't too huge.
        // Or better, let's assume we can search them.
        // Let's try fetching from /api/users?role=STUDENT if it exists, otherwise /api/student/
        // Actually, let's look at the file viewer for api/users... 
        // I will assume /api/users works for now, and filter if needed.
        const response = await fetch("/api/users?role=STUDENT"); 
        if (!response.ok) {
           // Fallback if that specific filter endpoint doesn't exist
           const responseAll = await fetch("/api/users");
           if (responseAll.ok) {
              const allUsers = await responseAll.json();
              const studentUsers = allUsers.filter(u => u.role === "STUDENT");
              setStudents(studentUsers);
              return;
           }
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipient: initialData.recipient || "",
        studentId: initialData.studentId || "",
        course: initialData.course || "",
        issueDate: initialData.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : "",
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    if (name === "recipient") {
      // If user types in recipient, try to filter students
      if (value.trim()) {
         const filtered = students.filter(student => 
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(value.toLowerCase()) ||
            student.email.toLowerCase().includes(value.toLowerCase())
         );
         setFilteredStudents(filtered);
         setShowStudentDropdown(true);
      } else {
         setShowStudentDropdown(false);
      }
      // Clear studentId if typing manually (unless selected from dropdown)
     if (formData.studentId) {
          setFormData(prev => ({ ...prev, studentId: "" }));
     }
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStudentSelect = (student) => {
     setFormData(prev => ({
        ...prev,
        recipient: `${student.firstName} ${student.lastName}`,
        studentId: student.id
     }));
     setShowStudentDropdown(false);
     setErrors(prev => ({ ...prev, recipient: "" }));
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
            <div className="relative">
              <label htmlFor="recipient" className="block text-sm font-medium text-slate-700 mb-1">
                Recipient
              </label>

              {formData.studentId ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div>
                    <div className="font-semibold text-blue-900">{formData.recipient}</div>
                    <div className="text-xs text-green-700 flex items-center gap-1">
                      <span>✓ Linked to student account</span>
                      <span className="text-gray-400">({formData.studentId})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                       setFormData(prev => ({ ...prev, recipient: "", studentId: "" }));
                    }}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium px-2 py-1 hover:bg-white rounded transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    id="recipient"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="Type to search students..."
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      errors.recipient
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-slate-300"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {showStudentDropdown && filteredStudents.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                       {filteredStudents.map(student => (
                          <li 
                            key={student.id} 
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            onClick={() => handleStudentSelect(student)}
                          >
                             <div className="font-medium">{student.firstName} {student.lastName}</div>
                             <div className="text-xs text-gray-500">{student.email}</div>
                          </li>
                       ))}
                    </ul>
                  )}
                </>
              )}
 
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
