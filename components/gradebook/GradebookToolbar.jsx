// components/gradebook/GradebookToolbar.jsx
import React from 'react';
import { FiFilter, FiDownload } from 'react-icons/fi';

const GradebookToolbar = ({ courses, assignments, exams }) => {
  const allAssignments = [...(assignments || []), ...(exams || [])];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <label htmlFor="class-filter" className="sr-only">Class</label>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            id="class-filter" 
            className="pl-10 pr-4 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm appearance-none bg-white"
          >
            <option>All Classes</option>
            {courses && courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label htmlFor="assignment-filter" className="sr-only">Assignment</label>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            id="assignment-filter" 
            className="pl-10 pr-4 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm appearance-none bg-white"
          >
            <option>All Assignments</option>
            {allAssignments.map(item => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md">
        <FiDownload />
        <span>Export Grades</span>
      </button>
    </div>
  );
};

export default GradebookToolbar;
