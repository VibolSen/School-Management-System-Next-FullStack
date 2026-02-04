"use client";

import { useUser } from "@/context/UserContext";
import FullPageLoading from "@/components/ui/FullPageLoading";
import SettingsView from "@/components/SettingsView";

export default function StudyOfficeSettingsPage() {
  const { user, loading } = useUser();

  if (loading) {
    return <FullPageLoading message="Loading settings..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EBF4F6]">
        <p className="text-slate-600">Please log in to access settings.</p>
      </div>
    );
  }

  return <SettingsView user={user} />;
}
