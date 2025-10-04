"use client";

export default function StudentList({
  students,
  attendance,
  handleAttendanceChange,
  getStatusColor,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Students List</h2>
        <p className="text-gray-600 text-sm">
          {students.length} students in this group
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                Attendance Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-blue-600 text-sm">
                        {student.firstName?.[0] ?? ''}
                        {student.lastName?.[0] ?? ''}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={attendance[student.id] || ""}
                    onChange={(e) =>
                      handleAttendanceChange(student.id, e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getStatusColor(
                      attendance[student.id]
                    )}`}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="PRESENT" className="text-green-600">
                      Present
                    </option>
                    <option value="ABSENT" className="text-red-600">
                      Absent
                    </option>
                    <option value="LATE" className="text-yellow-600">
                      Late
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total students: {students.length}</span>
        </div>
      </div>
    </div>
  );
}