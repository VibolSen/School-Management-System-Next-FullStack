import React from 'react';
import { BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

const GradebookTable = ({ students, assignments, gradebookData }) => {
  const { submissions, examSubmissions } = gradebookData;

  const getStudentGrade = (studentId, itemId, isExam) => {
    const submission = isExam
      ? examSubmissions.find(s => s.studentId === studentId && s.examId === itemId)
      : submissions.find(s => s.studentId === studentId && s.assignmentId === itemId);

    return submission ? submission.grade : 'N/A';
  };

  const getGradeBadge = (grade) => {
    if (grade === 'N/A') return 'bg-slate-50 text-slate-400 border-slate-100';
    if (grade >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (grade >= 80) return 'bg-blue-50 text-blue-700 border-blue-100';
    if (grade >= 70) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    if (grade >= 60) return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
  };

  if ((!students || students.length === 0) || (!assignments || assignments.length === 0)) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <BookOpen className="mx-auto h-12 w-12 text-slate-200 mb-3" />
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Grade Data found</h3>
        <p className="text-slate-500 text-[13px] mt-1">There are no records matching your current filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Student Identity
              </th>
              {assignments.map(item => (
                <th key={item.id} scope="col" className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 min-w-[120px]">
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((student, studentIdx) => (
              <motion.tr 
                key={student.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(studentIdx * 0.03, 0.4) }}
                className="group hover:bg-slate-50/20 transition-colors"
              >
                <td className="px-5 py-3 whitespace-nowrap">
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight">
                          {student.firstName} {student.lastName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Academic Profile</span>
                      </div>
                   </div>
                </td>
                {assignments.map(item => {
                  const grade = getStudentGrade(student.id, item.id, !!item.examDate);
                  return (
                    <td key={item.id} className="px-5 py-3 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-black border rounded-lg uppercase tracking-tight ${getGradeBadge(grade)} transition-all group-hover:scale-110 inline-block`}>
                        {grade}
                      </span>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradebookTable;
