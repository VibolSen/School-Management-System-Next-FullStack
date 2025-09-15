"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import { AttendanceStatus } from "@/lib/types";
// V IMPORTANT: Import your authentication store's hook.
// The path might be different in your project.
import { useAuthStore } from "@/store/auth"; // <--- ADD THIS IMPORT

const StudentDashboard = () => {
  const [myProfile, setMyProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the token directly from your Zustand store.
  // This is reactive. The component will know when the token is ready.
  const token = useAuthStore((state) => state.token); // <--- GET TOKEN FROM STORE

  useEffect(() => {
    // This function will only run when the `token` has a value.
    const fetchData = async () => {
      // Guard Clause: If the token is not yet available, do nothing.
      // The effect will re-run automatically when the token appears.
      if (!token) {
        setLoading(true); // Keep loading until token is available
        return;
      }

      try {
        setLoading(true); // Start loading once we have a token

        // First, get the current user's ID
        const meResponse = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meResponse.ok) {
          throw new Error(
            `Failed to fetch user data (Status: ${meResponse.status})`
          );
        }

        const { user: me } = await meResponse.json();
        const studentId = me.id;

        // Then, fetch the student's profile, attendance, and borrowed books
        const [profileResponse, attendanceResponse, booksResponse] =
          await Promise.all([
            fetch(`/api/students/${studentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`/api/attendances?studentId=${studentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`/api/library?borrowedBy=${studentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (!profileResponse.ok)
          throw new Error("Failed to fetch student profile");
        if (!attendanceResponse.ok)
          throw new Error("Failed to fetch attendance data");
        if (!booksResponse.ok)
          throw new Error("Failed to fetch borrowed books");

        const profileData = await profileResponse.json();
        const attendanceData = await attendanceResponse.json();
        const booksData = await booksResponse.json();

        setMyProfile(profileData);
        setAttendance(attendanceData);
        setBorrowedBooks(booksData);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // <--- CRITICAL: Add `token` to the dependency array

  const overallAttendance = useMemo(() => {
    if (!myProfile) return "N/A";
    const myRecords = attendance;
    if (myRecords.length === 0) return "100%";
    const presentCount = myRecords.filter(
      (r) =>
        r.status === AttendanceStatus.PRESENT ||
        r.status === AttendanceStatus.LATE
    ).length;
    return `${Math.round((presentCount / myRecords.length) * 100)}%`;
  }, [myProfile, attendance]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!myProfile) return <div>Student profile not found.</div>;

  return (
    // ... JSX remains the same
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

      {/* Courses */}
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

        {/* Borrowed Books */}
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