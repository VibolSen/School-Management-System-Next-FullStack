'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, Search, Filter, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SortIndicator = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="text-indigo-600 ml-1">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
};

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Filters Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Faculty Index</h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all text-slate-700"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={12} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm shrink-0">
            <Filter size={12} className="text-slate-400" />
            <select
              value={filterDepartments}
              onChange={(e) => setFilterDepartments(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-tight focus:outline-none cursor-pointer text-slate-600"
            >
              <option value="all">All Departments</option>
              <option value="none">No Departments</option>
              <option value="1">1 Department</option>
              <option value="2-5">2-5 Departments</option>
              <option value="6+">6+ Departments</option>
            </select>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-indigo-700 text-[10px] font-black uppercase tracking-tight rounded-lg border border-blue-100 shrink-0">
            {filteredFaculties.length} Total Faculties
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/10 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Faculty Designation
                  <SortIndicator direction={sortColumn === 'name' ? sortDirection : null} />
                </div>
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
                Division Scope
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && filteredFaculties.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 border-none">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mapping Assets...</span>
                  </div>
                </td>
              </tr>
            ) : filteredFaculties.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center">
                   <div className="flex flex-col items-center opacity-40">
                     <Layers size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No faculty divisions found</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredFaculties.map((faculty, index) => (
                <motion.tr 
                  key={faculty.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.4) }}
                  className="group hover:bg-indigo-50/20 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100 shadow-sm shadow-blue-100 uppercase">
                        {faculty.name.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{faculty.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Academic Body</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="px-2 py-0.5 text-[9px] font-black text-indigo-700 bg-blue-50 rounded-md border border-blue-100 uppercase tracking-wide">
                      {(faculty.departments || []).length} Departments Associated
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEditClick(faculty)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Modify Division"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(faculty)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove Division"
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
};

export default FacultyTable;
