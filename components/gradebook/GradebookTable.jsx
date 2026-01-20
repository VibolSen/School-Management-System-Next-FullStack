// components/gradebook/GradebookTable.jsx
import React from 'react';
import { FiBookOpen } from 'react-icons/fi';

const GradebookTable = ({ gradebookData }) => {
  const { courses, assignments, exams, submissions, examSubmissions } = gradebookData;

  const allAssignments = [...(assignments || []), ...(exams || [])];

  const getStudentGrade = (studentId, itemId, isExam) => {
    const submission = isExam
      ? examSubmissions.find(s => s.studentId === studentId && s.examId === itemId)
      : submissions.find(s => s.studentId === studentId && s.assignmentId === itemId);

    return submission ? submission.grade : 'N/A';
  };

  const getGradeColor = (grade) => {
    if (grade === 'N/A') return 'text-gray-400';
    if (grade >= 90) return 'text-green-600 font-semibold';
    if (grade >= 80) return 'text-green-500';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-500';
    return 'text-red-600 font-semibold';
  };

  const students = courses.flatMap(course => course.groups.flatMap(group => group.students));
  const uniqueStudents = Array.from(new Set(students.map(s => s.id)))
    .map(id => {
      return students.find(s => s.id === id);
    });

  if (uniqueStudents.length === 0 || allAssignments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow">
        <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Gradebook Data</h3>
        <p className="mt-1 text-sm text-gray-500">There are no students or assignments to display.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            {allAssignments.map(item => (
              <th key={item.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {uniqueStudents.map((student, studentIdx) => (
            <tr key={student.id} className={studentIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                {`${student.firstName} ${student.lastName}`}
              </td>
              {allAssignments.map(item => {
                const grade = getStudentGrade(student.id, item.id, !!item.examDate);
                return (
                  <td key={item.id} className={`px-6 py-4 whitespace-nowrap text-sm ${getGradeColor(grade)}`}>
                    {grade}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradebookTable;
