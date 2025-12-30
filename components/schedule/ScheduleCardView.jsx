// components/schedule/ScheduleCardView.jsx
import React from 'react';
import Link from 'next/link';

export default function ScheduleCardView({ schedules, onEdit, onDelete, onSelectSchedule, selectedSchedules }) {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">No schedules to display.</p>
        <p className="text-md text-gray-500">Create a new schedule to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800 break-words pr-2">{schedule.title}</h3>
              <input
                type="checkbox"
                checked={selectedSchedules.includes(schedule.id)}
                onChange={() => onSelectSchedule(schedule.id)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 transition duration-150 ease-in-out"
              />
            </div>
            <p className="text-gray-600 mb-2">{schedule.description}</p> {/* Keep description if it exists, though not in new schema for schedule */}
            <div className="text-sm text-gray-500 space-y-1">
              {schedule.isRecurring ? (
                <>
                  <p><strong>Recurring:</strong> Yes</p>
                  <p><strong>Period:</strong> {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}</p>
                  <p><strong>Days:</strong> {schedule.daysOfWeek.join(', ')}</p>
                </>
              ) : (
                <p><strong>Date:</strong> {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : 'N/A'}</p>
              )}

              <p className="font-semibold mt-2">Sessions:</p>
              {schedule.sessions && schedule.sessions.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {schedule.sessions.map((session, index) => (
                    <li key={index}>
                      {new Date(`1970-01-01T${session.startTime}`).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })} -
                      {new Date(`1970-01-01T${session.endTime}`).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sessions defined.</p>
              )}
              {schedule.assignedToTeacher && (
                <p><strong>Teacher:</strong> {schedule.assignedToTeacher.firstName} {schedule.assignedToTeacher.lastName}</p>
              )}
              {schedule.assignedToGroup && (
                <p><strong>Group:</strong> {schedule.assignedToGroup.name}</p>
              )}
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => onEdit(schedule)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(schedule.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
