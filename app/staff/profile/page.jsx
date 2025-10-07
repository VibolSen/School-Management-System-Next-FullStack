"use client";

import { useUser } from "@/context/UserContext";
import ProfilePageContent from "@/components/ProfilePageContent";

export default function ProfilePage() {
  const { user, loading } = useUser();

  const handleUpdateProfile = async (formData) => {
    // Implement your update logic here
    // For example, make a PUT request to your API
    console.log("Updating profile with:", formData);
    // Return the updated user data
    return user;
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
