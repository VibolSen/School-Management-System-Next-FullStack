import React, { useState, useMemo } from "react";
import { Edit, Trash2, Search, Layers, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DepartmentsTable({
  departments,
  onAddDepartmentClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = useMemo(() => {
    if (!Array.isArray(departments)) return [];
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
           <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Organization Roster</h2>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all text-slate-700"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={12} />
            </div>
            <div className="hidden md:flex px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-tight rounded-lg border border-blue-100 shrink-0">
              {filteredDepartments.length} Departments
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/10 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Unit</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Associated Faculty</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Courses</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 border-none">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mapping Units...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                   <div className="flex flex-col items-center opacity-40">
                     <Layers size={24} className="mb-2" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No departments mapped</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredDepartments.map((dept, index) => (
                <motion.tr 
                  key={dept.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.4) }}
                  className="group hover:bg-blue-50/20 transition-colors"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-200">
                        {dept.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{dept.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Academic Division</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <GraduationCap size={14} className="text-slate-400" />
                       <span className="text-[13px] font-semibold text-slate-600">{dept.faculty?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-0.5 text-[10px] font-black text-blue-800 bg-blue-50 rounded border border-blue-100 uppercase tracking-widest">
                      {dept._count?.departmentCourses ?? 0} modules
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditClick(dept)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit Unit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(dept)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Unit"
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
}