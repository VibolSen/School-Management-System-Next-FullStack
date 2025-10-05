// components/gradebook/GradebookTable.jsx
import React from 'react';

const GradebookTable = ({ gradebookData }) => {
  const { courses, assignments, exams, submissions, examSubmissions } = gradebookData;

  const allAssignments = [...(assignments || []), ...(exams || [])];

  const getStudentGrade = (studentId, itemId, isExam) => {
    const submission = isExam
      ? examSubmissions.find(s => s.studentId === studentId && s.examId === itemId)
      : submissions.find(s => s.studentId === studentId && s.assignmentId === itemId);

    return submission ? submission.grade : 'N/A';
  };

  const students = courses.flatMap(course => course.groups.flatMap(group => group.students));
  const uniqueStudents = Array.from(new Set(students.map(s => s.id)))
    .map(id => {
      return students.find(s => s.id === id);
    });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            {allAssignments.map(item => (
              <th key={item.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {uniqueStudents.map(student => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</td>
              {allAssignments.map(item => (
                <td key={item.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getStudentGrade(student.id, item.id, !!item.examDate)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradebookTable;
