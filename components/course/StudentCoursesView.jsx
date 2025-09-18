
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

// The main view component for the student's course list
export default function StudentCoursesView({ loggedInUser }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const studentId = loggedInUser?.id;

  // Fetches the courses for the logged-in student
  const fetchStudentCourses = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/my-courses?studentId=${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch your courses.");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      // You could set an error state here
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentCourses();
  }, [fetchStudentCourses]);

  // Memoized filtering for the search input
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.teacher &&
          `${course.teacher.firstName} ${course.teacher.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [courses, searchTerm]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Enrolled Courses
          </h2>
          <input
            type="text"
            placeholder="Search by course, department, or teacher..."
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
                <th className="px-6 py-3">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    Loading your courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">
                    You are not enrolled in any courses.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="bg-white border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {course.department?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {course.teacher ? (
                        `${course.teacher.firstName} ${course.teacher.lastName}`
                      ) : (
                        <span className="italic text-gray-400">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
