'use client';

import React from 'react';

const FacultyTable = ({ faculties, onEditClick, onDeleteClick, isLoading, onAssignDirectorClick }) => {
  return (
    <div className="overflow-x-auto bg-white p-4 rounded shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Existing Faculties</h3>
      {isLoading ? (
        <p>Loading faculties...</p>
      ) : faculties.length === 0 ? (
        <p>No faculties found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Faculty Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departments
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Director
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faculties.map((faculty) => (
              <tr key={faculty.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {faculty.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {faculty.departments.length === 0
                    ? 'None'
                    : faculty.departments.length === 1
                    ? faculty.departments[0].name
                    : faculty.departments.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {faculty.head ? `${faculty.head.firstName} ${faculty.head.lastName}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onEditClick(faculty)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteClick(faculty)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => onAssignDirectorClick(faculty)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Assign Director
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FacultyTable;
