"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import ClockIcon from "@/components/icons/ClockIcon";

const FacultyDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      const fetchFacultyDashboardData = async () => {
        try {
          const res = await fetch(
            `/api/dashboard/faculty?facultyId=${loggedInUser.id}`
          );
          if (!res.ok) throw new Error("Failed to fetch dashboard data");
          const data = await res.json();
          setDashboardData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFacultyDashboardData();
    }
  }, [loggedInUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!dashboardData) {
    return <p>No data available.</p>;
  }

  const { totalCourses, totalStudents, todaysAttendanceRate, todaysSchedule, courseAttendanceData } = dashboardData;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {loggedInUser?.name}!
      </h1>
      <p className="text-slate-500">Here's your teaching summary for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="My Courses"
          value={totalCourses.toString()}
          icon={<BookOpenIcon />}
        />
        <DashboardCard
          title="Total Students"
          value={totalStudents.toString()}
          icon={<UsersIcon />}
        />
        <DashboardCard
          title="Today's Attendance"
          value={todaysAttendanceRate}
          icon={<ChartBarIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Today's Attendance by Course
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={courseAttendanceData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis unit="%" />
              <Tooltip />
              <Bar
                dataKey="Attendance Rate"
                fill="#3b82f6"
                name="Attendance Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Today's Schedule
            </h2>
            {todaysSchedule.length > 0 ? (
              <ul className="space-y-3">
                {todaysSchedule.map((course) => (
                  <li key={course.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-slate-100 p-2 rounded-full text-slate-500">
                      <ClockIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">
                        {course.name}
                      </p>
                      <p className="text-sm text-slate-500">{course.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No classes scheduled for today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;