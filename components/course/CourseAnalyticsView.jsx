"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";

const CourseAnalyticsView = () => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user from your auth system (replace with actual implementation)
  const currentUser = { id: "S001", role: "teacher" }; // Example user

  // Fetch courses, students, and attendance records from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, studentsRes, attendanceRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/users?role=student"),
          fetch("/api/attendances"),
        ]);

        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        if (!studentsRes.ok) throw new Error("Failed to fetch students");
        if (!attendanceRes.ok) throw new Error("Failed to fetch attendances");

        const coursesData = await coursesRes.json();
        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();

        setCourses(coursesData);
        setStudents(studentsData);
        setAttendances(attendanceData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const myCourses = useMemo(() => {
    if (currentUser.role === "admin") {
      return courses; // Admins see all courses
    }
    return courses.filter((c) => c.instructorId === currentUser.id);
  }, [courses, currentUser]);

  useEffect(() => {
    if (!selectedCourseId && myCourses.length > 0) {
      setSelectedCourseId(myCourses[0].id);
    }
  }, [myCourses, selectedCourseId]);

  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return myCourses.find((c) => c.id === selectedCourseId) || null;
  }, [selectedCourseId, myCourses]);

  const courseData = useMemo(() => {
    if (!selectedCourse) return null;

    // Get enrolled students for this course
    const enrolledStudents = students.filter((student) =>
      student.enrollments?.some(
        (enrollment) => enrollment.courseId === selectedCourse.id
      )
    );

    // Get attendance records for this course
    const courseAttendanceRecords = attendances.filter(
      (rec) => rec.courseId === selectedCourse.id
    );

    // Calculate overall attendance rate
    const presentCount = courseAttendanceRecords.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;

    const overallAttendanceRate =
      courseAttendanceRecords.length > 0
        ? Math.round((presentCount / courseAttendanceRecords.length) * 100)
        : 0;

    // Calculate attendance trend by date
    const attendanceByDate = {};
    courseAttendanceRecords.forEach((record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0];
      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = { present: 0, total: 0 };
      }
      attendanceByDate[dateKey].total++;
      if (record.status === "PRESENT" || record.status === "LATE") {
        attendanceByDate[dateKey].present++;
      }
    });

    const attendanceTrend = Object.entries(attendanceByDate)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        "Attendance Rate": Math.round((data.present / data.total) * 100),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10);

    // Calculate individual student attendance
    const studentAttendance = enrolledStudents.map((student) => {
      const studentRecords = courseAttendanceRecords.filter(
        (rec) => rec.userId === student.id
      );
      const studentPresentCount = studentRecords.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE"
      ).length;
      const attendanceRate =
        studentRecords.length > 0
          ? Math.round((studentPresentCount / studentRecords.length) * 100)
          : 0;

      // Get most recent status
      const sortedRecords = [...studentRecords].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const lastStatus = sortedRecords[0]?.status || "N/A";

      return {
        ...student,
        attendanceRate,
        lastStatus,
      };
    });

    return {
      enrolledStudents,
      overallAttendanceRate,
      attendanceTrend,
      studentAttendance,
      totalRecords: courseAttendanceRecords.length,
      presentCount,
    };
  }, [selectedCourse, students, attendances]);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value || null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-600">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">Course Analytics</h1>
      <p className="text-slate-500">
        Dive into the performance and engagement metrics for your courses.
      </p>

      <div className="bg-white p-4 rounded-xl shadow-md sticky top-0 z-10">
        <label
          htmlFor="course-selector"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Select a Course
        </label>
        <select
          id="course-selector"
          value={selectedCourseId || ""}
          onChange={handleCourseChange}
          className="w-full sm:max-w-md px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          {myCourses.length > 0 ? (
            myCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))
          ) : (
            <option disabled>No courses assigned to you</option>
          )}
        </select>
      </div>

      {!selectedCourse || !courseData ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            {myCourses.length > 0 ? "Select a course" : "No courses found"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {myCourses.length > 0
              ? "Please choose a course from the dropdown to view its analytics."
              : "You are not currently assigned to any courses."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Enrolled Students"
              value={courseData.enrolledStudents.length.toString()}
              icon={<UsersIcon />}
              subtitle="Total students enrolled"
            />
            <DashboardCard
              title="Overall Attendance"
              value={`${courseData.overallAttendanceRate}%`}
              icon={<ChartBarIcon />}
              subtitle={`${courseData.presentCount}/${courseData.totalRecords} sessions`}
            />
            <DashboardCard
              title="Attendance Trend"
              value={
                courseData.attendanceTrend.length > 0
                  ? `${
                      courseData.attendanceTrend[
                        courseData.attendanceTrend.length - 1
                      ]["Attendance Rate"]
                    }%`
                  : "N/A"
              }
              icon={<ChartBarIcon />}
              subtitle="Latest session rate"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Attendance Trend (Last 10 Sessions)
              </h2>
              {courseData.attendanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={courseData.attendanceTrend}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Attendance Rate"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Attendance Rate"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-slate-500">
                  No attendance data available for this course yet.
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Student Roster & Engagement
              </h2>
              <div className="overflow-y-auto max-h-[300px]">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3 text-center">Attendance</th>
                      <th className="px-4 py-3 text-center">Last Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.studentAttendance.length > 0 ? (
                      courseData.studentAttendance
                        .sort((a, b) => a.name?.localeCompare(b.name || ""))
                        .map((student) => (
                          <tr
                            key={student.id}
                            className="bg-white border-b hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {student.name || "Unknown Student"}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold">
                              <span
                                className={
                                  student.attendanceRate >= 80
                                    ? "text-green-600"
                                    : student.attendanceRate >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }
                              >
                                {student.attendanceRate}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-semibold">
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  student.lastStatus === "PRESENT"
                                    ? "bg-green-100 text-green-800"
                                    : student.lastStatus === "LATE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : student.lastStatus === "ABSENT"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {student.lastStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-10 text-slate-500"
                        >
                          No students are currently enrolled in this course.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {courseData.studentAttendance.length > 0 && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Attendance Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-green-600 font-semibold">
                        {
                          courseData.studentAttendance.filter(
                            (s) => s.attendanceRate >= 80
                          ).length
                        }
                      </div>
                      <div className="text-slate-500">Good (80%+)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-600 font-semibold">
                        {
                          courseData.studentAttendance.filter(
                            (s) =>
                              s.attendanceRate >= 60 && s.attendanceRate < 80
                          ).length
                        }
                      </div>
                      <div className="text-slate-500">Fair (60-79%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-semibold">
                        {
                          courseData.studentAttendance.filter(
                            (s) => s.attendanceRate < 60
                          ).length
                        }
                      </div>
                      <div className="text-slate-500">Poor (&lt;60%)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Analytics Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Course Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">
                  Course Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Course Title:</span>
                    <span className="font-medium">{selectedCourse.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Department:</span>
                    <span className="font-medium">
                      {selectedCourse.department || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Instructor:</span>
                    <span className="font-medium">
                      {selectedCourse.instructor?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Sessions:</span>
                    <span className="font-medium">
                      {courseData.totalRecords}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">
                  Performance Metrics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average Attendance:</span>
                    <span className="font-medium">
                      {courseData.overallAttendanceRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Students Enrolled:</span>
                    <span className="font-medium">
                      {courseData.enrolledStudents.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Completion Rate:</span>
                    <span className="font-medium">
                      {courseData.enrolledStudents.length > 0
                        ? Math.round(
                            (courseData.enrolledStudents.filter(
                              (s) =>
                                s.enrollments?.find(
                                  (e) => e.courseId === selectedCourse.id
                                )?.progress >= 100
                            ).length /
                              courseData.enrolledStudents.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseAnalyticsView;
