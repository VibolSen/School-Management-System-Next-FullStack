'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';

const FacultyTable = ({ faculties, onEditClick, onDeleteClick, isLoading, onAddFacultyClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterDepartments, setFilterDepartments] = useState('all');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedFaculties = useMemo(() => {
    let sortableFaculties = [...faculties];
    if (sortColumn) {
      sortableFaculties.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }
    return sortableFaculties;
  }, [faculties, sortColumn, sortDirection]);

  const filteredFaculties = useMemo(() => {
    return sortedFaculties.filter((faculty) => {
      const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase());
      const departmentCount = (faculty.departments || []).length;

      let matchesFilter = true;
      if (filterDepartments === 'none') {
        matchesFilter = departmentCount === 0;
      } else if (filterDepartments === '1') {
        matchesFilter = departmentCount === 1;
      } else if (filterDepartments === '2-5') {
        matchesFilter = departmentCount >= 2 && departmentCount <= 5;
      } else if (filterDepartments === '6+') {
        matchesFilter = departmentCount >= 6;
      }

      return matchesSearch && matchesFilter;
    });
  }, [sortedFaculties, searchTerm, filterDepartments]);

  const renderSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? (
        <ChevronUp className="w-4 h-4 ml-1" />
      ) : (
        <ChevronDown className="w-4 h-4 ml-1" />
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-2">
        <h2 className="text-lg font-semibold text-blue-700 transition-colors duration-300">
          Faculty Directory
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-44 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          />
          <select
            value={filterDepartments}
            onChange={(e) => setFilterDepartments(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white hover:border-blue-400 hover:ring-blue-200 transition-all duration-200"
          >
            <option value="all">All Departments</option>
            <option value="none">No Departments</option>
            <option value="1">1 Department</option>
            <option value="2-5">2-5 Departments</option>
            <option value="6+">6+ Departments</option>
          </select>
          <button
            onClick={onAddFacultyClick}
            className="w-full md:w-auto bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Add New Faculty
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Loading faculties...</p>
      ) : filteredFaculties.length === 0 ? (
        <p>No faculties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-2.5 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                              onClick={() => handleSort('name')}
                            >
                              <div className="flex items-center gap-1.5">
                                Faculty Name {renderSortIndicator('name')}
                              </div>
                            </th><th
                              scope="col"
                              className="px-4 py-2.5 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                            >
                              Departments
                            </th><th scope="col" className="px-4 py-2.5 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaculties.map((faculty) => (
                <tr
                  key={faculty.id}
                  className="hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-[1.005]"
                >
                  <td className="px-4 py-2.5 whitespace-nowrap text-sm font-medium text-gray-900">
                    {faculty.name}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-900">
                    {(faculty.departments || []).length === 0
                      ? 'None'
                      : (faculty.departments || []).length === 1
                      ? (faculty.departments || [])[0].name
                      : faculty.departments.length}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 space-x-3 text-center">
                    <button
                      onClick={() => onEditClick(faculty)}
                      className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                      title="Edit Faculty"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClick(faculty)}
                      className="text-red-600 hover:text-red-800 transition-all duration-200"
                      title="Delete Faculty"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyTable;
