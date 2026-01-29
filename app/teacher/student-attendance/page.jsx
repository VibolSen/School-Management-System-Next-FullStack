"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import StatusMessage from "@/components/StatusMessage";
import { Paper } from "@mui/material";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const StudentAttendancePage = () => {
  const { user } = useUser();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ✅ added missing state

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/teacher/my-groups?teacherId=${user.id}`)
        .then((res) => res.json())
        .then(setGroups)
        .catch((error) => {
          console.error("Failed to fetch groups:", error);
          setStatus({
            type: "error",
            message: "Failed to fetch your groups.",
          });
        });
    }
  }, [user]);

  useEffect(() => {
    if (selectedGroup && date) {
      setLoadingStudents(true);
      Promise.all([
        fetch(`/api/teacher/groups/${selectedGroup}/students`)
          .then((res) => res.json())
          .then(setStudents)
          .catch((error) => {
            console.error("Failed to fetch students:", error);
            setStatus({
              type: "error",
              message: "Failed to fetch students for the selected group.",
            });
            return { students: [] };
          }),
        fetch(`/api/teacher/groups/${selectedGroup}/attendance?date=${date}`)
          .then((res) => res.json())
          .then((data) => {
            const newAttendance = {};
            data.forEach((att) => {
              newAttendance[att.studentId] = att.status;
            });
            setAttendance(newAttendance);
            return data;
          })
          .catch((error) => {
            console.error("Failed to fetch attendance:", error);
            return [];
          }),
      ]).finally(() => setLoadingStudents(false));
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedGroup, date]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!selectedGroup || !date) {
      setStatus({ type: "error", message: "Please select a group and date." });
      return;
    }

    setSubmitting(true);

    const attendances = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId],
    }));

    try {
      const response = await fetch(
        `/api/teacher/groups/${selectedGroup}/attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, attendances }),
        }
      );

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Attendance submitted successfully!",
        });
      } else {
        const errorData = await response.json();
        setStatus({
          type: "error",
          message:
            errorData.error || "An error occurred while submitting attendance.",
        });
      }
    } catch (error) {
      console.error("Submit attendance error:", error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Student Attendance
      </h1>

      {status && <StatusMessage type={status.type} message={status.message} />}

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        {/* ✅ ADDED FORM HERE */}
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-end">
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
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              required
            >
              <option value="">-- Select a Group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="date-picker"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date-picker"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end md:justify-start">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedGroup || students.length === 0 || submitting}
            >
              {submitting ? (
                <LoadingSpinner size="xs" color="white" className="mr-2" />
              ) : null}
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </div>

        {loadingStudents ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner size="md" color="blue" />
            <p className="ml-4 text-gray-600">Loading students...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="PRESENT"
                            checked={attendance[student.id] === "PRESENT"}
                            onChange={() =>
                              handleAttendanceChange(student.id, "PRESENT")
                            }
                            className="form-radio h-4 w-4 text-green-600"
                          />
                          <span className="ml-2 text-green-700">Present</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="ABSENT"
                            checked={attendance[student.id] === "ABSENT"}
                            onChange={() =>
                              handleAttendanceChange(student.id, "ABSENT")
                            }
                            className="form-radio h-4 w-4 text-red-600"
                          />
                          <span className="ml-2 text-red-700">Absent</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="LATE"
                            checked={attendance[student.id] === "LATE"}
                            onChange={() =>
                              handleAttendanceChange(student.id, "LATE")
                            }
                            className="form-radio h-4 w-4 text-yellow-600"
                          />
                          <span className="ml-2 text-yellow-700">Late</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600 text-lg">No students found for this group or date.</p>
          </div>
        )}
        </form>
        {/* ✅ FORM CLOSES HERE */}
      </Paper>
    </div>
  );
};

export default StudentAttendancePage;