"use client";

import React, { useState, useMemo, useEffect } from "react";
import AttendanceTable from "./AttendanceTable";

const AttendanceView = ({ loggedInUser, roleToView = "student" }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]); // users with role student
  const [departments, setDepartments] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const currentUserId = loggedInUser?.id;
  const currentUserRole = loggedInUser?.role;
  const canGenerateQr =
    loggedInUser?.role?.name === "faculty" ||
    loggedInUser?.role?.name === "Admin" ||
    loggedInUser?.role?.name === "teacher";

  // -------------------------------
  // Update attendance status
  // -------------------------------
  const handleStatusChange = async (recordId, newStatus) => {
    try {
      const statusObj = attendanceStatuses.find((s) => s.name === newStatus);
      if (!statusObj) {
        console.error("Invalid status name provided:", newStatus);
        return;
      }

      const res = await fetch(`/api/attendances?id=${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusId: statusObj.id }),
      });

      if (!res.ok)
        throw new Error(`Failed to update attendance: ${res.statusText}`);

      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, status: { name: newStatus, id: statusObj.id } }
            : record
        )
      );
    } catch (error) {
      console.error("Failed to update attendance:", error);
    }
  };

  // -------------------------------
  // Filter courses by department
  // -------------------------------
  const coursesByDepartment = useMemo(() => {
    if (departmentFilter === "All") return courses;
    const selectedDepartment = departments.find(
      (dep) => dep.name === departmentFilter
    );
    if (!selectedDepartment) return [];
    return courses.filter((c) => c.departmentId === selectedDepartment.id);
  }, [departmentFilter, courses, departments]);

  useEffect(() => {
    if (!coursesByDepartment.some((c) => c.id === courseFilter)) {
      setCourseFilter("All");
    }
  }, [coursesByDepartment, courseFilter]);



  // -------------------------------
  // Fetch attendance records
  // -------------------------------
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedDate) params.append("date", selectedDate);
        if (departmentFilter !== "All") {
          const dept = departments.find((d) => d.name === departmentFilter);
          if (dept) params.append("departmentId", dept.id);
        }
        if (courseFilter !== "All") params.append("courseId", courseFilter);
        if (statusFilter !== "All") {
          const status = attendanceStatuses.find(
            (s) => s.name === statusFilter
          );
          if (status) params.append("statusId", status.id);
        }

        const res = await fetch(`/api/attendances?${params.toString()}`); // Corrected API endpoint
        console.log("Attendance records API response:", res);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAttendanceRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch attendance records:", error);
        setAttendanceRecords([]);
      }
    };

    if (
      departments.length > 0 &&
      attendanceStatuses.length > 0 &&
      courses.length > 0
    ) {
      fetchAttendanceRecords();
    }
  }, [
    selectedDate,
    departmentFilter,
    courseFilter,
    statusFilter,
    departments,
    attendanceStatuses,
    courses,
  ]);

  // -------------------------------
  // Prepare display data
  // -------------------------------
  const displayData = useMemo(() => {
    if (
      !Array.isArray(attendanceRecords) ||
      !Array.isArray(students) ||
      !Array.isArray(courses) ||
      !Array.isArray(attendanceStatuses)
    )
      return [];

    const studentMap = new Map(students.map((s) => [s.id, s]));
    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const statusMap = new Map(attendanceStatuses.map((s) => [s.id, s]));
    const departmentMap = new Map(departments.map((d) => [d.id, d.name]));

    return attendanceRecords
      .map((record) => {
        const student = studentMap.get(record.userId);
        const course = courseMap.get(record.courseId);
        const status = statusMap.get(record.statusId);
        if (!student || !course || !status) return null;

        const departmentName = departmentMap.get(course.departmentId) || "N/A";

        return {
          ...record,
          studentName: `${student.firstName} ${student.lastName}`,
          courseName: course.name,
          department: departmentName,
          status: status.name,
        };
      })
      .filter((record) => record !== null)
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [attendanceRecords, students, courses, attendanceStatuses, departments]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Attendance Tracking</h1>
      <p className="text-slate-500">
        Monitor and manage student attendance records for daily classes.
      </p>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date */}
          <div>
            <label
              htmlFor="date-filter"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="dept-filter"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Department
            </label>
            <select
              id="dept-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Departments</option>
              {departments.map((dep) => (
                <option
                  key={dep.id}
                  value={dep.name}
                  className="text-slate-800"
                >
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label
              htmlFor="course-filter"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Course
            </label>
            <select
              id="course-filter"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Courses</option>
              {coursesByDepartment.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                  className="text-slate-800"
                >
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Statuses</option>
              {attendanceStatuses.map((status) => (
                <option
                  key={status.id}
                  value={status.name}
                  className="text-slate-800"
                >
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <AttendanceTable
        records={displayData}
        onStatusChange={handleStatusChange}
        attendanceStatuses={attendanceStatuses}
      />
    </div>
  );
};

export default AttendanceView;
