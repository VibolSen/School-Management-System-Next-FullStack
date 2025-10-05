"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { ClipboardList, FileText } from 'lucide-react';
import UsersIcon from "@/components/icons/UsersIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";

import Link from "next/link";

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

  const { myProfile } = dashboardData;

  console.log("myProfile:", myProfile);

  const currentCourses = myProfile.enrollments.filter(
    (enrollment) => enrollment.progress < 100
  );
  const pastCourses = myProfile.enrollments.filter(
    (enrollment) => enrollment.progress === 100
  );

  console.log("currentCourses:", currentCourses);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {myProfile.firstName}!
      </h1>
      <p className="text-slate-500">
        Here's your personal dashboard and academic summary.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Current Courses"
          value={currentCourses.length.toString()}
          icon={<BookOpenIcon />}
        />
        <DashboardCard
          title="Past Courses"
          value={pastCourses.length.toString()}
          icon={<BookOpenIcon />}
        />
        <DashboardCard
          title="My Groups"
          value={myProfile.groups.length.toString()}
          icon={<UsersIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            My Groups
          </h2>
          <ul className="space-y-3">
            {myProfile.groups.map((group) => (
              <li
                key={group.id}
                className="p-3 bg-slate-50 rounded-lg"
              >
                <p className="font-semibold text-slate-800">{group.name}</p>
                <ul className="space-y-1 mt-2">
                  {group.students.map((student) => (
                    <li key={student.id} className="text-sm text-slate-500">
                      {student.firstName} {student.lastName}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            My Courses
          </h2>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-700">
              Current Courses
            </h3>
            <ul className="space-y-3">
              {currentCourses.map((enrollment) => {
                const course = enrollment.course;
                if (!course) return null;
                return (
                  <li
                    key={course.id}
                    className="p-3 bg-slate-50 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{course.name}</p>
                      <p className="text-sm text-slate-500">{course.courseDepartments[0]?.department?.name || 'N/A'}</p>
                      <p className="text-sm text-slate-500">{course.leadBy?.firstName} {course.leadBy?.lastName}</p>
                      <p className="text-sm text-slate-500">{course.groups.map(group => group.name).join(', ')}</p>
                    </div>
                    <Link href={`/student/courses/${course.id}`}>
                      <a className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                        {course.id}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-slate-700">
              Past Courses
            </h3>
            <ul className="space-y-3">
              {pastCourses.map((enrollment) => {
                const course = enrollment.course;
                if (!course) return null;
                return (
                  <li
                    key={course.id}
                    className="p-3 bg-slate-50 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{course.name}</p>
                      <p className="text-sm text-slate-500">{course.courseDepartments[0]?.department?.name || 'N/A'}</p>
                      <p className="text-sm text-slate-500">{course.leadBy?.firstName} {course.leadBy?.lastName}</p>
                      <p className="text-sm text-slate-500">{course.groups.map(group => group.name).join(', ')}</p>
                    </div>
                    <Link href={`/student/courses/${course.id}`}>
                      <a className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                        {course.id}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;