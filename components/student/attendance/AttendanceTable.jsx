import React from "react";
import AttendanceRow from "./AttendanceRow";
import { motion, AnimatePresence } from "framer-motion";

const AttendanceTable = ({ attendance }) => {
  if (!attendance || attendance.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400 font-medium">
        No attendance records found for this period.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Group</th>
            <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Presence Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          <AnimatePresence>
            {attendance.map((record, index) => (
              <AttendanceRow key={record.id} record={record} index={index} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
