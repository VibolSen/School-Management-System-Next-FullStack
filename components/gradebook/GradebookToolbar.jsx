// components/gradebook/GradebookToolbar.jsx
import React from 'react';

const GradebookToolbar = ({ courses, assignments, exams }) => {
  const allAssignments = [...(assignments || []), ...(exams || [])];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="class-filter" className="text-sm font-medium text-gray-700">Class</label>
          <select id="class-filter" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>All Classes</option>
            {courses && courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="assignment-filter" className="text-sm font-medium text-gray-700">Assignment</label>
          <select id="assignment-filter" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>All Assignments</option>
            {allAssignments.map(item => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </div>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Export Grades</button>
    </div>
  );
};

export default GradebookToolbar;
