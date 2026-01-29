import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Eye, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TeacherTable({
  teachers = [],
  onAddTeacherClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
  canManageTeachers,
  currentUserRole,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.email &&
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [teachers, searchTerm]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
        <h2 className="text-lg font-semibold text-blue-700 transition-colors duration-300">Teacher Roster</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-44 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <button
            onClick={onAddTeacherClick}
            className="w-full md:w-auto bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Add Teacher
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5 text-center">Assigned Courses</th>
              {canManageTeachers && <th className="px-4 py-2.5 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && teachers.length === 0 ? (
              <tr>
                <td colSpan={canManageTeachers ? 4 : 3} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <LoadingSpinner size="md" color="blue" />
                    <span className="text-sm font-medium text-slate-500 animate-pulse">
                      Retrieving teacher records...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No teachers found.
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-[10px] mr-3">
                        {teacher.firstName.charAt(0)}
                        {teacher.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-xs">
                          {`${teacher.firstName} ${teacher.lastName}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{teacher.email}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                      {teacher._count?.ledCourses ?? 0}
                    </span>
                  </td>
                  {canManageTeachers && (
                    <td className="px-4 py-2.5 text-sm font-medium space-x-3 text-center">
                      <button
                        onClick={() => onEditClick(teacher)}
                        className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                        title="Edit Teacher"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {currentUserRole && (
                        <Link 
                          href={`/${currentUserRole.toLowerCase()}/users/${teacher.id}`}
                          className="inline-block"
                          title="View Profile"
                        >
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                            disabled={isLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => onDeleteClick(teacher)}
                        className="text-red-600 hover:text-red-900 transition-all duration-200"
                        title="Delete Teacher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}