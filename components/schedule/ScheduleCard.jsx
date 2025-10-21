import React from 'react';

export default function ScheduleCard({ schedule, onEdit, onDelete, onSelect, isSelected, canSelect, currentUser }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className={`bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-4 ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {schedule.title}
        </h3>
        {canSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(schedule.id)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        )}
      </div>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        {schedule.description}
      </p>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(schedule.date)}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Time</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
            </dd>
          </div>
          {schedule.assignedToTeacher && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned to Teacher</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {schedule.assignedToTeacher.firstName} {schedule.assignedToTeacher.lastName}
              </dd>
            </div>
          )}
          {schedule.assignedToGroup && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned to Group</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {schedule.assignedToGroup.name}
              </dd>
            </div>
          )}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created By</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {schedule.creator.firstName} {schedule.creator.lastName}
            </dd>
          </div>
        </dl>
      </div>
      {currentUser?.role === 'ADMIN' && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={() => onEdit(schedule)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}