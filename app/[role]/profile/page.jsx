"use client";

import { useUser } from "@/context/UserContext";
import FullPageLoading from "@/components/ui/FullPageLoading";

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
    return <FullPageLoading message="Accessing profile data..." />;
  }

  return (
    <ProfilePageContent
      user={user}
      isCurrentUser={true}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}