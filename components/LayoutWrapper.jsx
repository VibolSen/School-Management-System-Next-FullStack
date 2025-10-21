"use client";

import { useUser } from "@/context/UserContext";
import Header from "../components/nav/Header";
import Navbar from "../components/nav/Navbar";
import Footer from "../components/nav/Footer";

export default function LayoutWrapper({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      // Optional: Add a loading spinner or skeleton for initial load
      <div>Loading application...</div>
    );
  }

  return (
    <>
      {user ? <Header /> : <Navbar />}
      {children}
      <Footer />
    </>
  );
}
