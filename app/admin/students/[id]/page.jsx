"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useParams } from "next/navigation";
import ProfilePageContent from "@/components/ProfilePageContent";
import Link from "next/link";
import FullPageLoading from "@/components/ui/FullPageLoading";

export default function StudentProfilePage() {
  const { user, loading: userLoading } = useUser();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch student data");
          }
          const data = await res.json();
          setStudent(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  if (isLoading || userLoading) {
    return <FullPageLoading message="Loading student records..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!student) {
    return <div>Student not found.</div>;
  }

  return (
    <div>
      <Link href="/admin/students">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition mb-4">
          Back to Student Management
        </button>
      </Link>
      <ProfilePageContent
        user={student}
        isCurrentUser={false}
        onUpdateProfile={async () => {}}
      />
    </div>
  );
}
