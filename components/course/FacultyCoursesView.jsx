"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import CourseModal from "./CourseModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";


export default function FacultyCoursesView({ loggedInUser }) {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]); // Will only contain the loggedInUser for now
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const teacherId = loggedInUser?.id;


  const fetchData = useCallback(async () => {
    if (!teacherId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [coursesRes, deptsRes] = await Promise.all([
        fetch(`/api/faculty/my-courses?teacherId=${teacherId}`),
        fetch("/api/departments"),
      ]);

      if (!coursesRes.ok) throw new Error("Failed to fetch your courses.");
      if (!deptsRes.ok) throw new Error("Failed to fetch departments.");

      setCourses(await coursesRes.json());
      setDepartments(await deptsRes.json());
      setTeachers([loggedInUser]); // Only the logged-in user is available as a teacher
    } catch (err) {
      console.error(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, loggedInUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (courseData) => {
    setIsLoading(true);
    const isEditing = !!editingCourse;
    const endpoint = isEditing
      ? `/api/courses?id=${editingCourse.id}`
      : "/api/courses";
    const method = isEditing ? "PUT" : "POST";

    // Ensure the logged-in faculty is the lead teacher
    const dataToSend = { ...courseData, teacherId: loggedInUser.id };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save course.");
      }
      console.log(`Course ${isEditing ? "updated" : "created"} successfully!`);
      await fetchData();
      handleCloseModal();
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses?id=${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.status !== 204 && !res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete the course.");
      }
      console.log("Course deleted successfully!");
      setCourses((prev) => prev.filter((c) => c.id !== itemToDelete.id));
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleAddClick = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (course) => {
    setItemToDelete(course);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Course
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Course Roster
          </h2>
          <input
            type="text"
            placeholder="Search by course or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Course Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 text-center">Groups</th>
                <th className="px-6 py-3 text-center">Students</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    You are not assigned to any courses.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4">
                      {course.department?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                        {course.groupCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {course.studentCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEditClick(course)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(course)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          courseToEdit={editingCourse}
          departments={departments}
          teachers={teachers} // Pass the logged-in user as the only teacher option
          isLoading={isLoading}
        />
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete the "${itemToDelete?.name}" course? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
}
