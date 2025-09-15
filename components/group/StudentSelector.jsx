"use client";

import React, { useState, useEffect, useRef } from "react";

export default function StudentSelector({
  allStudents,
  selectedStudentIds,
  setSelectedStudentIds,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const safeSelectedStudentIds = Array.isArray(selectedStudentIds)
    ? selectedStudentIds
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelection = (studentId) => {
    const newIds = safeSelectedStudentIds.includes(studentId)
      ? safeSelectedStudentIds.filter((id) => id !== studentId)
      : [...safeSelectedStudentIds, studentId];
    setSelectedStudentIds(newIds);
  };

  const filteredStudents = allStudents.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudents = allStudents.filter((s) =>
    safeSelectedStudentIds.includes(s.id)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Add Students (Optional)
      </label>
      <div
        role="button"
        tabIndex="0"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
        className="w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex flex-wrap gap-1 min-h-[20px]">
          {selectedStudents.length === 0 ? (
            <span className="text-slate-500">Select students...</span>
          ) : (
            selectedStudents.map((student) => (
              <span
                key={student.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {student.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelection(student.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-slate-300 text-sm focus:outline-none"
          />
          <ul className="list-none p-0 m-0">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                onClick={() => handleSelection(student.id)}
                className="flex items-center py-2 px-3 hover:bg-slate-100 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={safeSelectedStudentIds.includes(student.id)}
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded"
                />
                <span className="ml-3">{student.name}</span>
              </li>
            ))}
            {filteredStudents.length === 0 && (
              <p className="text-center text-xs text-gray-500 py-2">
                No students found
              </p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
