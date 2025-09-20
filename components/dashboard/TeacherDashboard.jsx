"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Users, Library, Award } from 'lucide-react';

const TeacherDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/teacher/dashboard?teacherId=${loggedInUser.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <DashboardCard
          title="My Students"
          value={dashboardData.totalStudents}
          icon={<Users className="w-6 h-6" />}
        />
        <DashboardCard
          title="My Courses"
          value={dashboardData.totalCourses}
          icon={<Library className="w-6 h-6" />}
        />
        <DashboardCard
          title="Average Grade"
          value={`${dashboardData.averageGrade}%`}
          icon={<Award className="w-6 h-6" />}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Students per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.studentsPerCourse}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;