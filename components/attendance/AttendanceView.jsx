"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import AttendanceTable from "./AttendanceTable";
import QRCodeGeneratorModal from "./QRCodeGeneratorModal";

const AttendanceView = ({ loggedInUser }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]); // These are 'users' with role 'student'
  const [departments, setDepartments] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isQrModalOpen, setIsQrModal] = useState(false);
  const [selectedCourseForQr, setSelectedCourseForQr] = useState(null);
  const [qrCourseSelection, setQrCourseSelection] = useState("");
  const [liveCheckedInStudents, setLiveCheckedInStudents] = useState([]);
  const [currentQrSessionId, setCurrentQrSessionId] = useState(null); // New state to hold the active QR session ID

  // Hardcoded role for now (replace with real auth later)
  const currentUserId = loggedInUser?.id;
  const currentUserRole = loggedInUser?.role;
const canGenerateQr =
  loggedInUser.role.name === "faculty" || loggedInUser.role.name === "Admin";


  // -------------------------------
  // Fetch courses, users, departments, and attendance statuses
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes, departmentsRes, statusesRes] =
          await Promise.all([
            fetch("/api/courses"),
            fetch("/api/users"),
            fetch("/api/departments"),
            fetch("/api/attendance-status"),
          ]);

        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const usersData = usersRes.ok ? await usersRes.json() : []; // Renamed to usersData
        const departmentsData = departmentsRes.ok
          ? await departmentsRes.json()
          : [];
        const statusesData = statusesRes.ok ? await statusesRes.json() : [];

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setStudents(
          Array.isArray(usersData)
            ? usersData.filter((user) => user.role === "student")
            : []
        ); // Filter for students
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
        setAttendanceStatuses(Array.isArray(statusesData) ? statusesData : []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchData();
  }, []);


  // -------------------------------
  // Fetch attendance records (to populate the table)
  // This should ideally be debounced or triggered on filter changes
  // For simplicity, let's fetch based on selectedDate and filters
  // -------------------------------
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        // Construct query parameters for filtering
        const params = new URLSearchParams();
        if (selectedDate) params.append("date", selectedDate);
        if (departmentFilter !== "All") {
          // Find department ID if departmentFilter is by name
          const dept = departments.find((d) => d.name === departmentFilter);
          if (dept) params.append("departmentId", dept.id);
        }
        if (courseFilter !== "All") params.append("courseId", courseFilter);
        if (statusFilter !== "All") {
          // Find status ID if statusFilter is by name
          const status = attendanceStatuses.find(
            (s) => s.name === statusFilter
          );
          if (status) params.append("statusId", status.id);
        }

        const res = await fetch(`/api/attendances?${params.toString()}`); // Corrected API endpoint
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAttendanceRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch attendance records:", error);
        setAttendanceRecords([]);
      }
    };

    // Ensure dependencies are loaded before fetching
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
    courses, // Added courses to dependency array
  ]);

  // -------------------------------
  // QR modal handlers
  // -------------------------------
  const handleCourseSelectionForQr = (courseId) => {
    setQrCourseSelection(courseId);
    if (!courseId) {
      setIsQrModal(false);
      setSelectedCourseForQr(null);
      setCurrentQrSessionId(null);
      setLiveCheckedInStudents([]); // Clear live checked-in students
      return;
    }
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setLiveCheckedInStudents([]);
      setSelectedCourseForQr(course);
      setIsQrModal(true);
      // The QRCodeGeneratorModal will handle the creation of the session
    }
  };

  const handleCloseQrModal = async () => {
    if (currentQrSessionId) {
      try {
        // Optionally update the session status to 'ended' or similar on the backend
        // For now, we just close the modal and delete the session.
        await fetch(`/api/qrcode-sessions?id=${currentQrSessionId}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete/end QR session:", error);
      }
    }
    setIsQrModal(false);
    setSelectedCourseForQr(null);
    setQrCourseSelection("");
    setCurrentQrSessionId(null);
    setLiveCheckedInStudents([]); // Clear live checked-in students on close
  };

  const handleQrSessionCreated = (sessionId) => {
    setCurrentQrSessionId(sessionId);
  };

  // -------------------------------
  // Total students in selected course
  // -------------------------------
  const totalStudentsInCourse = useMemo(() => {
    if (!selectedCourseForQr || !Array.isArray(students)) return 0;
    // Assuming a student object has a 'courses' array, and each course object in that array has an 'id'
    return students.filter(
      (student) =>
        Array.isArray(student.courses) &&
        student.courses.some((course) => course.id === selectedCourseForQr.id)
    ).length;
  }, [students, selectedCourseForQr]);

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
        // Corrected API endpoint
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusId: statusObj.id }), // Send statusId
      });

      if (!res.ok)
        throw new Error(`Failed to update attendance: ${res.statusText}`);

      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, status: { name: newStatus, id: statusObj.id } } // Update status object correctly
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
    return courses.filter((c) => c.departmentId === selectedDepartment.id); // Assuming course has departmentId
  }, [departmentFilter, courses, departments]);

  useEffect(() => {
    if (!coursesByDepartment.some((c) => c.id === courseFilter)) {
      setCourseFilter("All");
    }
  }, [coursesByDepartment, courseFilter]);

  // -------------------------------
  // Prepare display data (client-side filtering for simplicity, backend filtering is better)
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
    const departmentMap = new Map(departments.map((d) => [d.id, d.name])); // Map for department names

    return attendanceRecords
      .map((record) => {
        const student = studentMap.get(record.userId); // Corrected to userId
        const course = courseMap.get(record.courseId);
        const status = statusMap.get(record.statusId);
        if (!student || !course || !status) return null;

        const departmentName = departmentMap.get(course.departmentId) || "N/A"; // Get department name

        return {
          ...record,
          studentName: `${student.firstName} ${student.lastName}`, // Assuming firstName and lastName
          courseName: course.title,
          department: departmentName,
          status: status.name,
        };
      })
      .filter((record) => record !== null) // Filter out records that couldn't be mapped
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [attendanceRecords, students, courses, attendanceStatuses, departments]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Attendance Tracking</h1>
      <p className="text-slate-500">
        Monitor and manage student attendance records for daily classes.
      </p>

      {/* QR Generator */}
      {canGenerateQr && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <label
            htmlFor="qr-course-select"
            className="font-semibold text-slate-800 mb-2 block"
          >
            Start Live QR Session
          </label>
          <select
            id="qr-course-select"
            value={qrCourseSelection}
            onChange={(e) => handleCourseSelectionForQr(e.target.value)}
            className="w-full sm:max-w-md px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Select a course...</option>
            {coursesByDepartment.map((course) => (
              <option
                key={course.id}
                value={course.id}
                className="text-slate-800"
              >
                {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

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
                  {course.title}
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

      {/* QR Modal */}
      <QRCodeGeneratorModal
        isOpen={isQrModalOpen}
        onClose={handleCloseQrModal}
        course={selectedCourseForQr}
        checkedInStudents={liveCheckedInStudents}
        totalStudents={totalStudentsInCourse}
        currentUserId={currentUserId} // now real user ID
        onQrSessionCreated={handleQrSessionCreated}
        activeQrSessionId={currentQrSessionId}
        setLiveCheckedInStudents={setLiveCheckedInStudents}
      />
    </div>
  );
};

export default AttendanceView;