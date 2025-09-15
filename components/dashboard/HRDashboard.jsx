"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const HRDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHRDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/hr");
        if (!response.ok) {
          throw new Error("Failed to fetch HR dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch current user");
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([fetchHRDashboardData(), fetchCurrentUser()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { totalStaff, activeStaff, onLeave, newHires, staffByDept, staffByStatus } = dashboardData;
  const realUser = currentUser?.name || "User";

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {realUser}!
      </h1>
      <p className="text-slate-500">
        Here's an overview of your staff management metrics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Staff"
          value={totalStaff.toString()}
          icon={<BriefcaseIcon />}
          change="" // Add empty string if prop is required
          changeType="neutral" // Add neutral change type
        />
        <DashboardCard
          title="Active Staff"
          value={activeStaff.toString()}
          icon={<UsersIcon />}
          change=""
          changeType="neutral"
        />
        <DashboardCard
          title="Staff on Leave"
          value={onLeave.toString()}
          icon={<BriefcaseIcon />}
          change=""
          changeType="neutral"
        />
        <DashboardCard
          title="New Hires (3 Mo)"
          value={newHires.toString()}
          icon={<UsersIcon />}
          change="+5%"
          changeType="increase"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Staff by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={staffByDept}
              margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                height={50}
                interval={0}
                fontSize={12}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Staff Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Staff by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={staffByStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {staffByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
