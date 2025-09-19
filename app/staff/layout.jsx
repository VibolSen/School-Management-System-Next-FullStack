"use client";

import { UserProvider } from "@/context/UserContext";

export default function StaffLayout({ children }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}