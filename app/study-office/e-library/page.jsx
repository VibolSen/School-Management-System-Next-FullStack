"use client";

import { useState, useEffect } from "react";
import ELibraryView from "@/components/e-library/ELibraryView";

export default function StudyOfficeELibraryPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  return <ELibraryView loggedInUser={user} />;
}