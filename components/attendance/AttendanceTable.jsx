import React from 'react';

const getStatusBadgeStyles = (status) => {
  switch (status) {
    case 'PRESENT':
      return 'text-green-800 bg-green-200 ring-green-300';
    case 'ABSENT':
      return 'text-red-800 bg-red-200 ring-red-300';
    case 'LATE':
      return 'text-yellow-800 bg-yellow-200 ring-yellow-300';
    default:
      return 'text-slate-800 bg-slate-200 ring-slate-300';
  }
};

const AttendanceTable = ({ records, onStatusChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Attendance Roster</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">Student Name</th>
              <th scope="col" className="px-6 py-3">Student ID</th>
              <th scope="col" className="px-6 py-3">Course</th>
              <th scope="col" className="px-6 py-3">Department</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{record.studentName}</td>
                <td className="px-6 py-4">{record.studentId}</td>
                <td className="px-6 py-4">{record.courseName}</td>
                <td className="px-6 py-4">{record.department}</td>
                <td className="px-6 py-4">
                  <select
                    value={record.status}
                    onChange={(e) => onStatusChange(record.id, e.target.value)}
                    className={`w-full md:w-auto pl-3 pr-8 py-1.5 border-0 rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 ring-1 ring-opacity-50 ${getStatusBadgeStyles(record.status)}`}
                    aria-label={`Update status for ${record.studentName}`}
                  >
                    {['PRESENT', 'ABSENT', 'LATE'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No records found</h3>
            <p className="mt-1 text-sm text-slate-500">
              No attendance records match your selected filters. Try adjusting the date or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;
