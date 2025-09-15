"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ClipboardListIcon from "@/components/icons/ClipboardListIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import BellIcon from "@/components/icons/BellIcon";
import UsersIcon from "@/components/icons/UsersIcon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TeacherDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      const fetchTeacherDashboardData = async () => {
        try {
          const res = await fetch(
            `/api/dashboard/teacher?teacherId=${loggedInUser.id}`
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

      fetchTeacherDashboardData();
    }
  }, [loggedInUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  const { classesToday, assignmentsToGrade, upcomingDueDate, studentQuestionCount, submissionsPerAssignment } = dashboardData;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {loggedInUser?.name}!
      </h1>
      <p className="text-slate-500">Your teaching dashboard for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Classes Today"
          value={classesToday.toString()}
          icon={<CalendarIcon />}
        />
        <DashboardCard
          title="Assignments to Grade"
          value={assignmentsToGrade.toString()}
          icon={<ClipboardListIcon />}
        />
        <DashboardCard
          title="Next Due Date"
          value={
            upcomingDueDate
              ? new Date(upcomingDueDate.dueDate).toLocaleDateString()
              : "N/A"
          }
          icon={<BellIcon />}
        />
        <DashboardCard
          title="New Student Questions"
          value={studentQuestionCount.toString()}
          icon={<UsersIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Recent Assignment Submissions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={submissionsPerAssignment}
              margin={{ top: 5, right: 20, left: -10, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="Submissions"
                fill="#3b82f6"
                name="Total Submissions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
              <p className="font-semibold text-slate-700">Post Announcement</p>
              <p className="text-sm text-slate-500">
                Share updates with your classes.
              </p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
              <p className="font-semibold text-slate-700">Schedule a Meeting</p>
              <p className="text-sm text-slate-500">
                Set up a video call with a student.
              </p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
              <p className="font-semibold text-slate-700">
                View Weekly Schedule
              </p>
              <p className="text-sm text-slate-500">
                See your upcoming classes and events.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;