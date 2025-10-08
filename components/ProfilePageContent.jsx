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
} from "lucide-react";

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

  // ✅ Added missing states
  const [imagePreview, setImagePreview] = useState("/default-cover.jpg");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-8xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isCurrentUser
                ? "Manage your account information"
                : "View user information"}
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-md mb-4 text-xs">
              {success}
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            {/* Profile Image */}
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
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition-colors">
                  <Camera className="w-4 h-4" />
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

            {editMode ? (
              <div className="w-full space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 hover:bg-gray-400 shadow-md hover:shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="space-y-2 mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName || user.lastName || "N/A"}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{user.role?.name}</span>
                  </div>
                </div>

                {isCurrentUser && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 mx-auto hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-6 mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Member since</span>
              <span className="text-sm font-medium text-gray-800">
                January 2023
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last login</span>
              <span className="text-sm font-medium text-gray-800">
                Today, 14:32
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        {isCurrentUser && (
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-6 mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Change Password
            </h2>
            {passwordError && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-xs">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-md mb-4 text-xs">
                {passwordSuccess}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  Old Password
                </label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your old password"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
              >
                <Shield className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-4 text-center hover:bg-white transition-colors">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Security
            </span>
          </button>

          <button className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-4 text-center hover:bg-white transition-colors">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Notifications
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
