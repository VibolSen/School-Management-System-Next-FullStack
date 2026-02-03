import React from 'react';
import { Filter, Download, ChevronDown } from 'lucide-react';

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
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 bg-blue-50/30">
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        
        {/* Course Filter */}
        <div className="relative group">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={12} />
          <select 
            id="course-filter" 
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="pl-8 pr-8 py-1.5 text-[10px] font-black uppercase tracking-tight border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg shadow-sm appearance-none bg-white w-full md:w-40 cursor-pointer transition-all"
          >
            <option value="ALL">All Classes</option>
            {courses && courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
        </div>

        {/* Group Filter */}
        <div className="relative group">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors" size={12} />
          <select 
            id="group-filter" 
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            disabled={!selectedCourse || selectedCourse === 'ALL'}
            className="pl-8 pr-8 py-1.5 text-[10px] font-black uppercase tracking-tight border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-lg shadow-sm appearance-none bg-white w-full md:w-36 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="ALL">All Groups</option>
            {groups && groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
        </div>

        {/* Assignment Filter */}
        <div className="relative group">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={12} />
          <select 
            id="assignment-filter" 
            value={selectedAssignment}
            onChange={(e) => onAssignmentChange(e.target.value)}
            className="pl-8 pr-8 py-1.5 text-[10px] font-black uppercase tracking-tight border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg shadow-sm appearance-none bg-white w-full md:w-56 cursor-pointer transition-all"
          >
            <option value="ALL">All Items</option>
            {assignments.map(item => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
        </div>

      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap">
        <Download size={14} />
        <span>Export Roster</span>
      </button>
    </div>
  );
};

export default GradebookToolbar;
