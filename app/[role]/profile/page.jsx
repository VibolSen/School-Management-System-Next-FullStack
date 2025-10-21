"use client";

import { useUser } from "@/context/UserContext";
import ProfilePageContent from "@/components/ProfilePageContent";

export default function ProfilePage() {
  const { user, loading } = useUser();

  const handleUpdateProfile = async (formData) => {
    try {
      const res = await fetch(`/api/users?id=${user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await res.json();
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfilePageContent
      user={user}
      isCurrentUser={true}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}