import React from "react";

export default function AnnouncementCard({ announcement, onEdit, onDelete, currentUser }) {
  const canModify = currentUser?.role === 'ADMIN';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-800">{announcement.title}</h3>
        {canModify && (
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
              Edit
            </button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 mt-2">{announcement.content}</p>
      <div className="text-sm text-gray-500 mt-4">
        <p>
          By {announcement.author.firstName} {announcement.author.lastName}
        </p>
        <p>{new Date(announcement.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
