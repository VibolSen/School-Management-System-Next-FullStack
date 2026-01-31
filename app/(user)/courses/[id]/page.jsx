"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FullPageLoading from "@/components/ui/FullPageLoading";

export default function CourseDetailPage({ params }) {
  // ✅ unwrap params (Next.js 15+)
  const { id } = use(params);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses?id=${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch course");
        }
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return <FullPageLoading message="Retrieving course details..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-4 text-primary">{course.name}</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <p className="text-gray-700 text-lg mb-2">
          <span className="font-semibold">Course ID:</span> {course.id}
        </p>

        {course.leadBy && (
          <p className="text-gray-700 text-lg mb-2">
            <span className="font-semibold">Lead By:</span>{" "}
            {course.leadBy.firstName} {course.leadBy.lastName}
          </p>
        )}

        {course.courseDepartments?.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold text-lg">Departments:</span>
            <ul className="list-disc list-inside ml-4">
              {course.courseDepartments.map((cd) => (
                <li key={cd.department.id} className="text-gray-700 text-lg">
                  {cd.department.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
