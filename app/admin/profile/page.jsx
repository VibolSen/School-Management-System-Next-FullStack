"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Edit3, Save, X, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Guest",
    email: "",
    role: { name: "Guest" },
    image: "https://picsum.photos/seed/default/100",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", imageFile: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
        setForm({ name: data.user.name, imageFile: null });
        setImagePreview(data.user.image);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
    setError("");
    setSuccess("");
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("name", form.name);
      if (form.imageFile) formData.append("image", form.imageFile);

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
      } else {
        setUser(data.user);
        setSuccess("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleCancel = () => {
    setForm({ name: user.name, imageFile: null });
    setImagePreview(user.image);
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
    <div className="min-h-screen  py-4 px-4">
      <div className="max-w-8xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account information
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
                src={imagePreview || user.image}
                alt={user.name}
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
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
                    {user.name}
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

                <button
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 mx-auto hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-4 text-center hover:bg-white transition-colors">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Security</span>
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
