"use client";

import React from "react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useUser } from "@/context/UserContext";

import FullPageLoading from "@/components/ui/FullPageLoading";

const StudentDashboardPage = () => {
  const { user: loggedInUser, loading } = useUser();

  if (loading) {
    return <FullPageLoading message="Preparing your dashboard..." />;
  }

  if (!loggedInUser) {
    return <p>Please log in to view the dashboard.</p>;
  }

  return <StudentDashboard loggedInUser={loggedInUser} />;
};

export default StudentDashboardPage;
