
"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useParams } from "next/navigation";
import ProfilePageContent from "@/components/ProfilePageContent";
import Link from "next/link";
import FullPageLoading from "@/components/ui/FullPageLoading";

export default function StaffProfilePage() {
  const { user, loading: userLoading } = useUser();
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchStaff = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch staff data");
          }
          const data = await res.json();
          setStaff(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStaff();
    }
  }, [id]);

  if (isLoading || userLoading) {
    return <FullPageLoading message="Verifying staff identity..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!staff) {
    return <div>Staff member not found.</div>;
  }

  return (
    <div>
      <Link href="/hr/staff">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition mb-4">
          Back to Staff Management
        </button>
      </Link>
      <ProfilePageContent
        user={staff}
        isCurrentUser={false}
        onUpdateProfile={async () => {}}
      />
    </div>
  );
}
