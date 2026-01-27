// FILE: components/assignments/AssignmentCard.jsx

"use client";

import { Edit, Trash2 } from "lucide-react";

const AssignmentCard = ({
  assignment,
  onNavigate,
  onEdit,
  onDelete,
  showActions = true,
  status,
  userRole, // Add userRole to props
}) => {
  // Function to determine the color scheme based on status
  const getStatusStyles = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "submitted":
        return {
          badge: "bg-green-100 text-green-800 border-green-200",
          icon: "text-green-500",
          gradient: "from-green-50 to-green-25",
          dueDate: "text-green-600",
        };
      case "graded":
        return {
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "text-blue-500",
          gradient: "from-blue-50 to-blue-25",
          dueDate: "text-blue-600",
        };
      case "late":
        return {
          badge: "bg-red-100 text-red-800 border-red-200",
          icon: "text-red-500",
          gradient: "from-red-50 to-red-25",
          dueDate: "text-red-600",
        };
      case "pending":
        return {
          badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "text-yellow-500",
          gradient: "from-yellow-50 to-yellow-25",
          dueDate: "text-yellow-600",
        };
      case "draft":
        return {
          badge: "bg-slate-100 text-slate-800 border-slate-200",
          icon: "text-slate-500",
          gradient: "from-slate-50 to-slate-25",
          dueDate: "text-slate-600",
        };
      default:
        return {
          badge: "bg-purple-100 text-purple-800 border-purple-200",
          icon: "text-purple-500",
          gradient: "from-purple-50 to-purple-25",
          dueDate: "text-purple-600",
        };
    }
  };

  // Get status icon based on status
  const getStatusIcon = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "submitted":
        return (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "graded":
        return (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
            />
          </svg>
        );
      case "late":
        return (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "pending":
        return (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  // Check if assignment is overdue
  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const styles = getStatusStyles(status);
  const statusIcon = getStatusIcon(status);

  return (
    <div className="group relative">
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105" />

      {/* Main Card */}
      <div
        className={`relative bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.01] group-hover:border-blue-200`}
      >
        {/* Status Gradient Bar */}
        <div className={`h-1 bg-gradient-to-r from-blue-400 to-purple-400`} />

        <div className="p-3">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-2.5">
            {/* Group Badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              <svg
                className="w-2.5 h-2.5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {assignment.group?.name || "No Group"}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles.badge}`}
            >
              {statusIcon}
              <span className="ml-1">{status || "No Status"}</span>
            </span>
          </div>

          {/* Assignment Title */}
          <div onClick={onNavigate} className="cursor-pointer mb-2 group/title">
            <h3 className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 group-hover/title:text-blue-600 transition-colors duration-200">
              {assignment.title || "Untitled Assignment"}
            </h3>
          </div>

          {/* Description Preview */}
          {assignment.description && (
            <p className="text-slate-600 text-[11px] mb-2.5 line-clamp-2 leading-relaxed">
              {assignment.description}
            </p>
          )}

          {/* Due Date & Info Section */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-3">
              {/* Due Date */}
              <div className="flex items-center text-[10px]">
                <svg
                  className={`w-3 h-3 mr-1 ${
                    isOverdue ? "text-red-500" : styles.icon
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className={
                    isOverdue ? "text-red-600 font-semibold" : styles.dueDate
                  }
                >
                  {assignment.dueDate
                    ? new Date(assignment.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "No due date"}
                  {isOverdue && " • Overdue"}
                </span>
              </div>

              {/* Points */}
              {assignment.points && (
                <div className="flex items-center text-[10px] text-slate-500">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  {assignment.points} pts
                </div>
              )}
            </div>
          </div>

          {/* Submission Count (if available) */}
          {assignment.submissionCount !== undefined && (
            <div className="mb-2.5">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Submissions: {assignment.submissionCount}</span>
                <span>
                  {assignment.totalStudents
                    ? `${Math.round(
                        (assignment.submissionCount /
                          assignment.totalStudents) *
                          100
                      )}%`
                    : ""}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      assignment.totalStudents
                        ? (assignment.submissionCount /
                            assignment.totalStudents) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (userRole === "ADMIN" || userRole === "TEACHER") && (
            <div className="flex justify-end space-x-3 pt-2.5 border-t border-slate-100">
              <button
                onClick={onEdit}
                className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                title="Edit Assignment"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800 transition-all duration-200"
                title="Delete Assignment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
