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

const CourseAnalyticsView = ({ loggedInUser }) => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch initial list of courses for the dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Admins see all courses, others see their own
        const url =
          loggedInUser.role === "ADMIN" || loggedInUser.role === "FACULTY"
            ? "/api/courses"
            : `/api/courses?teacherId=${loggedInUser.id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
        // Select the first course by default
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Could not load course list.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [loggedInUser]);

  // Fetch analytics data when a course is selected
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseData(null);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `/api/course-analytics?courseId=${selectedCourseId}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch analytics");
        }
        const data = await res.json();
        setCourseData(data);
      } catch (err) {
        console.error(`Analytics fetch error for ${selectedCourseId}:`, err);
        setError(err.message);
        setCourseData(null); // Clear old data on error
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedCourseId]);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value || null);
  };

  const selectedCourse = courseData?.course;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">Course Analytics</h1>
      <p className="text-slate-500">
        Dive into the performance and engagement metrics for your courses.
      </p>

      <div className="bg-white p-4 rounded-xl shadow-md top-0 z-10">
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
          disabled={loading && !courseData} // Disable while initial courses load
          className="w-full sm:max-w-md px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          {courses.length > 0 ? (
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))
          ) : (
            <option disabled>
              {loading ? "Loading courses..." : "No courses assigned to you"}
            </option>
          )}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Loading analytics data...</div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          <h3 className="font-bold">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && !selectedCourseId && (
         <div className="text-center py-20 bg-white rounded-xl shadow-md">
           <h3 className="mt-2 text-sm font-semibold text-slate-900">
             No courses found
           </h3>
           <p className="mt-1 text-sm text-slate-500">
             You are not currently assigned to any courses.
           </p>
         </div>
      )}

      {!loading && !error && selectedCourseId && !courseData && (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            Select a course
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Please choose a course from the dropdown to view its analytics.
          </p>
        </div>
      )}


      {!loading && !error && courseData && (
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
              title="Completion Rate"
              value={`${courseData.completionRate}%`}
              icon={<ChartBarIcon />}
              subtitle="Based on progress"
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
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((student) => (
                          <tr
                            key={student.id}
                            className="bg-white border-b hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {`${student.firstName} ${student.lastName}`}
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
                                  student.lastStatus === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : student.lastStatus === "Late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : student.lastStatus === "Absent"
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
                    <span className="font-medium">{selectedCourse.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Department:</span>
                    <span className="font-medium">
                      {selectedCourse.department.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Instructor:</span>
                    <span className="font-medium">
                      {`${selectedCourse.teacher.firstName} ${selectedCourse.teacher.lastName}` ||
                        "N/A"}
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
                      {courseData.completionRate}%
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
