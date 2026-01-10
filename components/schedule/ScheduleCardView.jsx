// components/schedule/ScheduleCardView.jsx
import React from 'react';
import Link from 'next/link';

export default function ScheduleCardView({ schedules, onEdit, onDelete, onSelectSchedule, selectedSchedules }) {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-indigo-600 font-semibold">No schedules to display.</p>
        <p className="text-md text-gray-500 mt-2">Create a new schedule to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-600 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-indigo-800 break-words pr-2 leading-tight">{schedule.title}</h3>
              <input
                type="checkbox"
                checked={selectedSchedules.includes(schedule.id)}
                onChange={() => onSelectSchedule(schedule.id)}
                className="form-checkbox h-6 w-6 text-indigo-600 rounded-md focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
              />
            </div>
            {/* Description is commented out in schema but kept here just in case */}
            {/* <p className="text-gray-500 mb-3">{schedule.description}</p> */}
            <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
              {schedule.isRecurring ? (
                <>
                  <p><strong className="text-indigo-700">Recurring:</strong> Yes</p>
                  <p><strong className="text-indigo-700">Period:</strong> {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}</p>
                  <p><strong className="text-indigo-700">Days:</strong> {schedule.daysOfWeek.join(', ')}</p>
                </>
              ) : (
                <p><strong className="text-indigo-700">Date:</strong> {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : 'N/A'}</p>
              )}

              <p className="font-semibold text-base text-indigo-800 mt-3 mb-1">Sessions:</p>
              {schedule.sessions && schedule.sessions.length > 0 ? (
                <ul className="list-disc list-inside ml-4 text-gray-700">
                  {schedule.sessions.map((session, index) => (
                    <li key={index}>
                      {new Date(`1970-01-01T${session.startTime}`).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })} -
                      {new Date(`1970-01-01T${session.endTime}`).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No sessions defined.</p>
              )}
              {schedule.assignedToTeacher && (
                <p><strong className="text-indigo-700">Teacher:</strong> {schedule.assignedToTeacher.firstName} {schedule.assignedToTeacher.lastName}</p>
              )}
              {schedule.assignedToGroup && (
                <p><strong className="text-indigo-700">Group:</strong> {schedule.assignedToGroup.name}</p>
              )}
            </div>
            <div className="mt-5 flex space-x-3">
              <button
                onClick={() => onEdit(schedule)}
                className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(schedule.id)}
                className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
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
