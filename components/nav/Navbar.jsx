"use client";
import { useState, useEffect , useRef} from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react"

export default function Navbar() {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); 

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCourses();
  }, []);

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

{/* Courses Dropdown */}
<div className="relative" ref={dropdownRef}>
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
    <div className="absolute top-full left-0 mt-8 w-48 bg-white shadow-lg rounded-2xl py-2">
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/courses/${course.slug}`}
          className="block px-4 py-2 hover:bg-gray-100 text-black transition-colors"
          onClick={() => setOpen(false)} // close dropdown after clicking
        >
          {course.title}
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
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
