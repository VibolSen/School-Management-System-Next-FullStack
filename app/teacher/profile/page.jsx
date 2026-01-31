"use client";

import { useUser } from "@/context/UserContext";
import FullPageLoading from "@/components/ui/FullPageLoading";

export default function ProfilePage() {
  const { user, loading } = useUser();

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await response.json();
      if (fetchUser) fetchUser();
      return data.user;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  if (loading) {
    return <FullPageLoading message="Authenticating teacher profile..." />;
  }

  return (
    <ProfilePageContent
      user={user}
      isCurrentUser={true}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}
