"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { useUser } from "../context/UserContext";

export default function ProfilePageContent({
  user: initialUser,
  isCurrentUser,
  onUpdateProfile,
}) {
  const [user, setUser] = useState(initialUser || {});
  const [loading, setLoading] = useState(!initialUser);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: initialUser?.firstName || "",
    lastName: initialUser?.lastName || "",
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState(
    initialUser?.profile?.avatar || "/default-cover.jpg"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (initialUser?.profile?.avatar) {
      setImagePreview(initialUser.profile.avatar);
    }
    setForm({
      firstName: initialUser?.firstName || "",
      lastName: initialUser?.lastName || "",
      imageFile: null,
    });
  }, [initialUser]);

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      const file = e.target.files[0];
      if (file) {
        setForm({ ...form, imageFile: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!isCurrentUser) return;

    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      if (form.imageFile) formData.append("image", form.imageFile);

      // We call the passed onUpdateProfile function
      const updatedUser = await onUpdateProfile(formData);

      setUser(updatedUser);
      setImagePreview(
        updatedUser.profile?.avatar
          ? `${updatedUser.profile.avatar}?${Math.random()}`
          : "/default-cover.jpg"
      );
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (!isCurrentUser) return;

    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      // This part needs to be adapted to your API endpoint for changing passwords
      // For now, we'll just simulate it.
      console.log("Changing password...", { oldPassword, newPassword });
      setPasswordSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      setPasswordError("Failed to update password");
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      imageFile: null,
    });
    setImagePreview(user.profile?.avatar || "/default-cover.jpg");
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4F6] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <LoadingSpinner size="md" color="blue" className="mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-[#EBF4F6]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <img
                  src={
                    imagePreview ||
                    user.profile?.avatar ||
                    "/default-cover.jpg"
                  }
                  alt={
                    user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName || user.lastName || "Profile Image"
                  }
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all active:scale-90 border-2 border-white">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-6 text-center">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || "N/A"}
              </h1>
              <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
                <span className="text-slate-300">|</span>
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium">
                {success}
              </div>
            )}

            {editMode ? (
              <div className="max-w-md mx-auto space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              isCurrentUser && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-xl text-[13px] font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )
            )}
          </div>
        </div>

        {/* Info & Password Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Account Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[13px] font-medium text-slate-500">Member since</span>
                <span className="text-[13px] font-bold text-slate-800">
                  January 2023
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[13px] font-medium text-slate-500">Status</span>
                <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 uppercase tracking-wide">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[13px] font-medium text-slate-500">Last login</span>
                <span className="text-[13px] font-bold text-slate-800">
                  Today, 14:32
                </span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          {isCurrentUser && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                Security
              </h2>

              {passwordError && (
                <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg mb-4 text-[12px] font-bold">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg mb-4 text-[12px] font-bold">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 mt-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
