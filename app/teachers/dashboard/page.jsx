"use client";

import React, { useState, useEffect } from "react";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";

const TeacherDashboardPage = () => {
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

  return <TeacherDashboard loggedInUser={loggedInUser} />;
};

export default TeacherDashboardPage;
