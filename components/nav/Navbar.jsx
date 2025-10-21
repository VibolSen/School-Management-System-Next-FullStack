"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [facultiesOpen, setFacultiesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        console.log('Fetched courses:', data);
        setCourses(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCourses();

    async function fetchFaculties() {
      try {
        const res = await fetch("/api/faculties");
        if (!res.ok) throw new Error("Failed to fetch faculties");
        const data = await res.json();
        setFaculties(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchFaculties();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-primary/30">
            <img
              src="/logo/STEP.jpg"
              alt="STEP Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            STEP
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>

          {/* Program Dropdown */}
          <div className="relative" onMouseEnter={() => setFacultiesOpen(true)} onMouseLeave={() => setFacultiesOpen(false)} ref={dropdownRef}>
            <button
              onClick={() => setFacultiesOpen((prev) => !prev)}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              Faculties
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-500 ${
                  facultiesOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {facultiesOpen && faculties.length > 0 && (
              <div className="absolute top-full left-0 mt-8 min-w-48 max-w-md bg-gray-200 shadow-lg rounded-2xl py-2 animate-fade-in-scale">
                {faculties.map((faculty) => (
                  <Link
                    key={faculty.id}
                    href={`/faculties/${faculty.id}`}
                    className="block px-4 py-2 hover:bg-gray-300 text-black transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                    onClick={() => setFacultiesOpen(false)} // close dropdown after clicking
                  >
                    {faculty.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Courses Dropdown */}
          <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              Courses
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-500 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {open && courses.length > 0 && (
              <div className="absolute top-full left-0 mt-8 min-w-48 max-w-md bg-gray-200 shadow-lg rounded-2xl py-2 animate-fade-in-scale">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block px-4 py-2 hover:bg-gray-300 text-black transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                    onClick={() => setOpen(false)} // close dropdown after clicking
                  >
                    {/* The text in the dropdown is the name of the course. The length of the text is determined by the length of the course.name string. */}
                    {course.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="space-x-4 flex items-center">
          {!loading &&
            (user ? (
              <>
                <div className="relative" ref={profileDropdownRef} onMouseEnter={() => setProfileDropdownOpen(true)} onMouseLeave={() => setProfileDropdownOpen(false)}>
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <span>
                      Welcome, {user.firstName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-500 ${
                        profileDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-8 w-48 bg-white shadow-lg rounded-2xl py-2">
                      <Link
                        href={`/${user.role.name.toLowerCase()}/profile`}
                        className="block px-4 py-2 hover:bg-gray-100 text-black transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
                        ) : (
              <Link
                href="https://t.me/vibolsen"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Ask Me
              </Link>
            ))} 
        </div>
      </div>
    </header>
  );
}
