// components/gradebook/GradebookToolbar.jsx
import React from 'react';
import { FiFilter, FiDownload } from 'react-icons/fi';

const GradebookToolbar = ({ 
  courses, 
  assignments, 
  groups,
  selectedCourse,
  selectedGroup,
  selectedAssignment,
  onCourseChange,
  onGroupChange,
  onAssignmentChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        
        {/* Course Filter */}
        <div className="relative">
          <label htmlFor="course-filter" className="sr-only">Class</label>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            id="course-filter" 
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="pl-10 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm appearance-none bg-white w-full md:w-48"
          >
            <option value="ALL">All Classes</option>
            {courses && courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        {/* Group Filter */}
        <div className="relative">
          <label htmlFor="group-filter" className="sr-only">Group</label>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            id="group-filter" 
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            disabled={!selectedCourse || selectedCourse === 'ALL'}
            className="pl-10 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm appearance-none bg-white w-full md:w-48 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="ALL">All Groups</option>
            {groups && groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>

        {/* Assignment Filter */}
        <div className="relative">
          <label htmlFor="assignment-filter" className="sr-only">Assignment</label>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            id="assignment-filter" 
            value={selectedAssignment}
            onChange={(e) => onAssignmentChange(e.target.value)}
            className="pl-10 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm appearance-none bg-white w-full md:w-64"
          >
            <option value="ALL">All Assignments</option>
            {assignments.map(item => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </div>

      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap">
        <FiDownload />
        <span>Export Grades</span>
      </button>
    </div>
  );
};

export default GradebookToolbar;
