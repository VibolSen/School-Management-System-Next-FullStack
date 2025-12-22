
"use client";

import React, { useState, useMemo } from "react";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="text-slate-500">
      {direction === "ascending" ? (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      )}
    </span>
  );
};

export default function CoursesTable({
  courses = [],
  departments = [],
  teachers = [],
  onAddCourseClick,
  onEdit,
  onDelete,
  isLoading,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [teacherFilter, setTeacherFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.courseDepartments &&
          course.courseDepartments.some((cd) =>
            cd.department.name.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
        (course.leadBy &&
          `${course.leadBy.firstName} ${course.leadBy.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

                const matchesDepartment =
                  departmentFilter === "All" ||
                  (course.courseDepartments &&
                    course.courseDepartments.some(
                      (cd) => cd.departmentId === departmentFilter
                    ));      const matchesTeacher =
        teacherFilter === "All" || course.leadById === teacherFilter;

      return matchesSearch && matchesDepartment && matchesTeacher;
    });
  }, [courses, searchTerm, departmentFilter, teacherFilter]);

  const sortedCourses = useMemo(() => {
    if (!sortConfig.key) return filteredCourses;
    return [...filteredCourses].sort((a, b) => {
      // Handle nested properties for sorting
      const aValue = sortConfig.key.split(".").reduce((o, i) => o?.[i], a);
      const bValue = sortConfig.key.split(".").reduce((o, i) => o?.[i], b);

      if (aValue < bValue)
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredCourses, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-blue-700 transition-colors duration-300">
          Course Directory
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          >
            <option value="All">All Teachers</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={onAddCourseClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Add Course
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  Course Name
                  <SortIndicator
                    direction={
                      sortConfig.key === "name" ? sortConfig.direction : null
                    }
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                onClick={() => handleSort("department.name")}
              >
                <div className="flex items-center gap-1.5">
                  Department
                  <SortIndicator
                    direction={
                      sortConfig.key === "department.name"
                        ? sortConfig.direction
                        : null
                    }
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                onClick={() => handleSort("leadBy.firstName")}
              >
                <div className="flex items-center gap-1.5">
                  Lead Teacher
                  <SortIndicator
                    direction={
                      sortConfig.key === "leadBy.firstName"
                        ? sortConfig.direction
                        : null
                    }
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-center hover:bg-slate-200 transition-colors duration-200">Groups</th>
              <th className="px-6 py-3 text-center hover:bg-slate-200 transition-colors duration-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Loading courses...
                </td>
              </tr>
            ) : sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No courses found matching your criteria.
                </td>
              </tr>
            ) : (
              sortedCourses.map((course) => (
                <tr key={course.id} className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {course.name}
                  </td>
                  <td className="px-6 py-4">
                    {course.courseDepartments && course.courseDepartments.length > 0
                      ? course.courseDepartments.map(cd => cd.department.name).join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {course.leadBy ? (
                      `${course.leadBy.firstName} ${course.leadBy.lastName}`
                    ) : (
                      <span className="italic text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                      {course._count?.groups ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEdit(course)}
                      className="text-indigo-600 hover:text-indigo-900 hover:scale-105 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(course)}
                      className="text-red-600 hover:text-red-800 hover:scale-105 transition-all duration-200"
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
  );
}
