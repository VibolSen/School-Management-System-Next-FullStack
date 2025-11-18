"use client";

import FacultyCoursesView from "@/components/course/FacultyCoursesView";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export default function CoursesPage() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user || user.role !== "FACULTY") {
    return <div>Unauthorized access.</div>;
  }

  return <FacultyCoursesView loggedInUser={user} />;
}