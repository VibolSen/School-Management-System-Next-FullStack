// app/admin/e-library/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import ELibraryView from "@/components/e-library/ELibraryView";

export default function ELibraryPage() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Or cookie
    if (!token) return;

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.text() : null)
      .then(text => {
        const data = text ? JSON.parse(text) : null;
        if (data?.user) setLoggedInUser(data.user);
      })
      .catch(console.error);
  }, []);

  return <ELibraryView loggedInUser={loggedInUser} />;
}
