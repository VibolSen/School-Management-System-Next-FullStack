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
import { Users, BarChart3 } from "lucide-react";

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Enrolled Students"
              value={courseData.enrolledStudents.length.toString()}
              icon={<Users className="w-6 h-6 text-blue-500" />}
              subtitle="Total students enrolled"
            />
            <DashboardCard
              title="Completion Rate"
              value={`${courseData.completionRate}%`}
              icon={<BarChart3 className="w-6 h-6 text-green-500" />}
              subtitle="Based on progress"
            />
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
                      {selectedCourse.courseDepartments?.[0]?.department?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Instructor:</span>
                    <span className="font-medium">
                      {`${selectedCourse.leadBy?.firstName} ${selectedCourse.leadBy?.lastName}` ||
                        "N/A"}
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
