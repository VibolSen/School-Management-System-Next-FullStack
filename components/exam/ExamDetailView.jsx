"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Notification from "@/components/Notification";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function ExamDetailView({ initialExam, loggedInUser }) {
  const [exam, setExam] = useState(initialExam);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionToGrade, setSubmissionToGrade] = useState(null);
  const [newGrade, setNewGrade] = useState("");
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  const router = useRouter();
  const userRole = loggedInUser?.role?.toLowerCase();
  const teacherId = loggedInUser?.id;

  const showMessage = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  }, []);

  const handleGradeChange = (e) => {
    setNewGrade(e.target.value);
  };

  const handleSaveGrade = async () => {
    if (!submissionToGrade || newGrade === "" || isSavingGrade) return;

    setIsSavingGrade(true);
    try {
      const res = await fetch(`/api/teacher/exam-submissions/${submissionToGrade.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: parseInt(newGrade, 10), status: "GRADED" }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to grade submission");
      }

      const updatedSubmission = await res.json();

      // Update the local state with the graded submission
      setExam((prevExam) => ({
        ...prevExam,
        submissions: prevExam.submissions.map((sub) =>
          sub.id === updatedSubmission.id ? updatedSubmission : sub
        ),
      }));

      showMessage("Submission graded successfully!", "success");
      setSubmissionToGrade(null);
      setNewGrade("");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsSavingGrade(false);
    }
  };

  const canGrade = userRole === "admin" || (userRole === "teacher" && exam.teacherId === teacherId);

  const backLink = userRole === "admin" ? "/admin/exam-management" : "/teacher/exam";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Notification
          {...notification}
          onClose={() => setNotification({ ...notification, show: false })}
        />

        <div className="flex items-center justify-between mb-5">
          <Link href={backLink} className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-4 py-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {userRole === "admin" ? "Exam Management" : "My Exams"}
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            {exam.title}
          </h1>
          <p className="text-slate-700 text-base">
            {exam.description || "No description provided."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 text-sm">
            <div>
              <span className="font-semibold">Group:</span> {exam.group?.name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Exam Date:</span>{" "}
              {exam.examDate
                ? new Date(exam.examDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Assigned By:</span>{" "}
              {exam.teacher ? `${exam.teacher.firstName} ${exam.teacher.lastName}` : "N/A"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Student Submissions</h2>

          {exam.submissions.length === 0 ? (
            <div className="flex items-center justify-center p-8 rounded-lg bg-slate-50 text-slate-500 italic">
              No students have submitted this exam yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Grade
                    </th>
                    {canGrade && (
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {exam.submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                        {submission.student?.firstName}{" "}
                        {submission.student?.lastName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            submission.status === "GRADED"
                              ? "bg-green-100 text-green-800"
                              : submission.status === "SUBMITTED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                        {submission.grade !== null ? submission.grade : "N/A"}
                      </td>
                      {canGrade && (
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          {submissionToGrade?.id === submission.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={newGrade}
                                onChange={handleGradeChange}
                                className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                                placeholder="Grade"
                                min="0"
                                max="100"
                              />
                              <button
                                onClick={handleSaveGrade}
                                disabled={isSavingGrade}
                                className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors duration-200"
                              >
                                {isSavingGrade ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={() => {
                                  setSubmissionToGrade(null);
                                  setNewGrade("");
                                }}
                                className="text-slate-500 hover:text-slate-700 px-3.5 py-1.5 rounded-lg text-xs transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSubmissionToGrade(submission);
                                setNewGrade(
                                  submission.grade !== null
                                    ? submission.grade.toString()
                                    : ""
                                );
                              }}
                              disabled={submission.status === "PENDING" || submission.status === "GRADED"} // Can only grade if submitted and not already graded
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors duration-200 disabled:opacity-50"
                            >
                              Grade
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}