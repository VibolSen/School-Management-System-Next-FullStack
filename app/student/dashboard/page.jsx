"use client";

import React, { useState, useEffect } from "react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

const StudentDashboardPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setLoggedInUser(data.user);
      })
      .catch(console.error);
  }, []);

  if (!loggedInUser) return <p>Loading...</p>;

  return <StudentDashboard loggedInUser={loggedInUser} />;
};

export default StudentDashboardPage;
