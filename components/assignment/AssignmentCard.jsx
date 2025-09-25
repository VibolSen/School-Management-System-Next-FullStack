// FILE: components/assignments/AssignmentCard.jsx

"use client";

import React from "react";

const AssignmentCard = ({ assignment, onNavigate, onEdit, onDelete, showActions = true, status }) => {
  // Function to determine the color of the status badge
  const getStatusBadgeStyle = (statusName) => {
    switch (statusName) {
      case "Submitted":
        return "bg-green-100 text-green-800";
      case "Graded":
        return "bg-blue-100 text-blue-800";
      case "Late":
        return "bg-red-100 text-red-800";
      case "Pending": // Assuming 'Pending' or similar is a status
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-5 border border-slate-100 flex flex-col justify-between"
    >
      <div onClick={onNavigate} className="cursor-pointer">
        {/* Group Name */}
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
          {assignment.group?.name || "No Group"}
        </p>

        {/* Assignment Title */}
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          {assignment.title || "Untitled Assignment"}
        </h3>
      </div>

      <div className="mt-4">
        {/* Due Date */}
        <p className="text-sm text-slate-500 mb-3">
          <strong>Due:</strong>{" "}
          {assignment.dueDate
            ? new Date(assignment.dueDate).toLocaleDateString()
            : "No due date"}
        </p>

        {/* Status Badge */}
        <div
          className={`text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full ${getStatusBadgeStyle(
            status
          )}`}
        >
          {status || "No Status"}
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onEdit} className="text-sm text-blue-600 hover:underline">Edit</button>
          <button onClick={onDelete} className="text-sm text-red-600 hover:underline">Delete</button>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
