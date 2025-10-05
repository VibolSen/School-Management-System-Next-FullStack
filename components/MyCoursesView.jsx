"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

// The main view component for the teacher's course list
export default function MyCoursesView({ loggedInUser }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name"); // e.g., "name", "department", "groups", "students"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  const teacherId = loggedInUser?.id;

  // Fetches the courses for the logged-in teacher
  const fetchMyCourses = useCallback(async () => {
    if (!teacherId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teacher/my-courses?teacherId=${teacherId}`);
      if (!res.ok) throw new Error("Failed to fetch your courses.");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      // You could set an error state here
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        if (res.ok) {
          const data = await res.json();
          setDepartments(data);
        } else {
          console.error("Failed to fetch departments:", res.status);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  // Memoized filtering and sorting for the search input and department filter
  const sortedAndFilteredCourses = useMemo(() => {
    let tempCourses = courses.filter(
      (course) =>
        (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.department?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedDepartment === "" || course.department?.id === selectedDepartment)
    );

    tempCourses.sort((a, b) => {
      let valA, valB;

      switch (sortCriteria) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case "department":
          valA = a.department?.name.toLowerCase() || "";
          valB = b.department?.name.toLowerCase() || "";
          break;
        case "groups":
          valA = a.groupCount;
          valB = b.groupCount;
          break;
        case "students":
          valA = a.studentCount;
          valB = b.studentCount;
          break;
        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return tempCourses;
  }, [courses, searchTerm, selectedDepartment, sortCriteria, sortOrder]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>

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
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="department">Sort by Department</option>
            <option value="groups">Sort by Groups</option>
            <option value="students">Sort by Students</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-32 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Course Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 text-center">Groups</th>
                <th className="px-6 py-3 text-center">Students</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    Loading your courses...
                  </td>
                </tr>
              ) : sortedAndFilteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    You are not assigned to any courses.
                  </td>
                </tr>
              ) : (
                sortedAndFilteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="bg-white border-b hover:bg-slate-50 border-slate-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
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
