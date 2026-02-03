"use client";

import React, { useState, useMemo } from "react";
import { Edit, Trash2, Search, BookOpen, Layers, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="text-blue-600 ml-1">
      {direction === "ascending" ? "↑" : "↓"}
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
          ));
      const matchesTeacher =
        teacherFilter === "All" || course.leadById === teacherFilter;

      return matchesSearch && matchesDepartment && matchesTeacher;
    });
  }, [courses, searchTerm, departmentFilter, teacherFilter]);

  const sortedCourses = useMemo(() => {
    if (!sortConfig.key) return filteredCourses;
    return [...filteredCourses].sort((a, b) => {
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Filters Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
           <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Academic Directory</h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all text-slate-700"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={12} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
            <Layers size={12} className="text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-tight focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="All text-slate-400">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="normal-case font-medium">{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
            <User size={12} className="text-slate-400" />
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-tight focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="All">All Instructors</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id} className="normal-case font-medium">
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/10 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">
                  Course Foundation
                  <SortIndicator direction={sortConfig.key === "name" ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Department</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Lead</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Groups</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 border-none">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 tracking-widest">Compiling Catalog...</span>
                  </div>
                </td>
              </tr>
            ) : sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                   <div className="flex flex-col items-center opacity-40">
                     <BookOpen size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No course entries matched</p>
                   </div>
                </td>
              </tr>
            ) : (
              sortedCourses.map((course, index) => (
                <motion.tr 
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.025, 0.4) }}
                  className="group hover:bg-blue-50/20 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100">
                        {course.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight truncate max-w-[150px]">{course.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Academic Course</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden lg:table-cell">
                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px] block uppercase tracking-tighter">
                      {course.courseDepartments && course.courseDepartments.length > 0
                        ? course.courseDepartments.map(cd => cd.department.name).join(", ")
                        : "General Faculty"}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                       <span className="text-[13px] font-semibold text-slate-700">
                         {course.leadBy ? `${course.leadBy.firstName} ${course.leadBy.lastName}` : "Pending Assign"}
                       </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <span className="px-2 py-0.5 text-[10px] font-black text-blue-800 bg-blue-50 rounded bg-blue-50/50 border border-blue-100 uppercase tracking-widest">
                       {course._count?.groups ?? 0} Sectors
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(course)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit Course"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(course)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
