"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AttendanceControls({
  groups,
  selectedGroup,
  setSelectedGroup,
  date,
  setDate,
  handleSaveAttendance,
  isSaving,
  students,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group Selection */}
        <div>
          <label
            htmlFor="group-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Group
          </label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          >
            <option value="">Choose a group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label
            htmlFor="date-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Date
          </label>
          <input
            id="date-select"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-end">
          <button
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
            onClick={handleSaveAttendance}
            disabled={isSaving || !selectedGroup || students.length === 0}
          >
            {isSaving ? (
              <LoadingSpinner size="xs" color="white" />
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Save Attendance</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}