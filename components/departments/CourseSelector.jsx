"use client";

import { useEffect, useState, useRef } from "react";

const CourseSelector = ({
  allCourses,
  selectedCourseIds,
  setSelectedCourseIds,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const safeSelectedCourseIds = Array.isArray(selectedCourseIds)
    ? selectedCourseIds
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

  const handleSelection = (courseId) => {
    const newIds = safeSelectedCourseIds.includes(courseId)
      ? safeSelectedCourseIds.filter((id) => id !== courseId)
      : [...safeSelectedCourseIds, courseId];
    setSelectedCourseIds(newIds);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const filteredCourses = allCourses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourses = allCourses.filter((c) =>
    safeSelectedCourseIds.includes(c.id)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        role="button"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex flex-wrap gap-1 min-h-[20px]">
          {selectedCourses.length === 0 ? (
            <span className="text-slate-500">Select courses...</span>
          ) : (
            selectedCourses.map((course) => (
              <span
                key={course.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {course.title}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelection(course.id);
                  }}
                  className="text-blue-600 hover:text-blue-800"
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
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 text-sm focus:outline-none"
          />
          <ul className="list-none p-0 m-0">
            {filteredCourses.map((course) => (
              <li
                key={course.id}
                onClick={() => handleSelection(course.id)}
                className="flex items-center py-2 px-3 hover:bg-slate-100 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={safeSelectedCourseIds.includes(course.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-3">{course.title}</span>
              </li>
            ))}
            {filteredCourses.length === 0 && (
              <p className="text-center text-xs text-gray-500 py-2">
                No courses found
              </p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseSelector;
