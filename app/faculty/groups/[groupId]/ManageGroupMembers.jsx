"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import Link from "next/link";

export default function ManageGroupMembers({ initialGroup, allStudents }) {
  const router = useRouter();
  const [enrolledStudentIds, setEnrolledStudentIds] = useState(
    initialGroup.students.map((s) => s.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Use memoization to efficiently calculate the two lists of students
  const { enrolledStudents, availableStudents } = useMemo(() => {
    const enrolled = [];
    const available = [];
    const enrolledSet = new Set(enrolledStudentIds);

    allStudents.forEach((student) => {
      if (enrolledSet.has(student.id)) {
        enrolled.push(student);
      } else {
        available.push(student);
      }
    });
    return { enrolledStudents: enrolled, availableStudents: available };
  }, [allStudents, enrolledStudentIds]);

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const handleAddStudent = (studentId) => {
    setEnrolledStudentIds((prev) => [...prev, studentId]);
  };

  const handleRemoveStudent = (studentId) => {
    setEnrolledStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/groups?id=${initialGroup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: enrolledStudentIds }), // Send the updated list of IDs
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save changes.");
      }
      showMessage("Group members updated successfully!");
      router.refresh(); // Refresh server-side props to get the latest data
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const StudentListItem = ({ student, onAction, actionLabel }) => (
    <div className="flex justify-between items-center p-2 border-b hover:bg-slate-50">
      <div>
        <p className="font-medium text-slate-800">{`${student.firstName} ${student.lastName}`}</p>
        <p className="text-xs text-slate-500">{student.email}</p>
      </div>
      <button
        onClick={() => onAction(student.id)}
        className="text-sm text-blue-600 hover:underline"
      >
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div>
        <Link
          href="/faculty/groups"
          className="text-blue-600 hover:underline text-sm"
        >
          &larr; Back to All Groups
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          Manage Members
        </h1>
        <p className="text-slate-600">
          Assign students to{" "}
          <span className="font-semibold">{initialGroup.name}</span> (
          {initialGroup.course.name})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enrolled Students Column */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Enrolled Students ({enrolledStudents.length})
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map((student) => (
                <StudentListItem
                  key={student.id}
                  student={student}
                  onAction={handleRemoveStudent}
                  actionLabel="Remove"
                />
              ))
            ) : (
              <p className="text-center text-slate-500 py-4">
                No students enrolled.
              </p>
            )}
          </div>
        </div>

        {/* Available Students Column */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Available Students ({availableStudents.length})
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {availableStudents.map((student) => (
              <StudentListItem
                key={student.id}
                student={student}
                onAction={handleAddStudent}
                actionLabel="Add"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
