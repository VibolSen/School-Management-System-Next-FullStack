"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";

const StudentDashboard = ({ loggedInUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      const fetchStudentDashboardData = async () => {
        try {
          const res = await fetch(
            `/api/dashboard/student?studentId=${loggedInUser.id}`
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

      fetchStudentDashboardData();
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

  const { myProfile, overallAttendance, borrowedBooks } = dashboardData;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {myProfile.name}!
      </h1>
      <p className="text-slate-500">
        Here's your personal dashboard and academic summary.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Enrolled Courses"
          value={myProfile.courses.length.toString()}
          icon={<BookOpenIcon />}
        />
        <DashboardCard
          title="Overall Attendance"
          value={overallAttendance}
          icon={<ChartBarIcon />}
        />
        <DashboardCard
          title="Borrowed Books"
          value={borrowedBooks.length.toString()}
          icon={<UsersIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            My Enrolled Courses
          </h2>
          <ul className="space-y-3">
            {myProfile.courses.map((course) => (
              <li
                key={course.id}
                className="p-3 bg-slate-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-slate-800">{course.name}</p>
                  <p className="text-sm text-slate-500">{course.department}</p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                  {course.id}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            My Borrowed Books
          </h2>
          {borrowedBooks.length > 0 ? (
            <ul className="space-y-3">
              {borrowedBooks.map((book) => (
                <li
                  key={book.id}
                  className="p-3 bg-slate-50 rounded-lg flex items-center space-x-4"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{book.title}</p>
                    <p className="text-sm text-slate-500">{book.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-center py-8">
              You have no books currently borrowed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;