import { Edit, Trash2, Eye } from "lucide-react";

const ExamCard = ({
  exam,
  onNavigate,
  onEdit,
  onDelete,
  status,
  showActions = false,
}) => {
  const getStatusBadgeStyle = (statusName) => {
    switch (statusName) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "GRADED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="group relative">
      {/* Main Card */}
      <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.01] group-hover:border-blue-200 flex flex-col justify-between h-full">
        {/* Top Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-400 to-blue-400" />

        <div className="p-3">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              {exam.group?.name || "No Group"}
            </span>

            {status && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(
                  status
                )}`}
              >
                {status}
              </span>
            )}
          </div>

          {/* Exam Title */}
          <div onClick={onNavigate} className="cursor-pointer mb-2 group/title">
            <h3 className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 group-hover/title:text-blue-600 transition-colors duration-200">
              {exam.title || "Untitled Exam"}
            </h3>
          </div>

          {/* Exam Date */}
          <div className="flex items-center space-x-3 mb-2.5">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {exam.examDate
                ? new Date(exam.examDate).toLocaleDateString()
                : "No date"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2.5 border-t border-slate-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate();
              }}
              className="text-blue-600 hover:text-blue-800 transition-all duration-200"
              title="View Exam"
            >
              <Eye className="w-4 h-4" />
            </button>
            {showActions && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-indigo-600 hover:text-indigo-900 transition-all duration-200"
                  title="Edit Exam"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-600 hover:text-red-800 transition-all duration-200"
                  title="Delete Exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;