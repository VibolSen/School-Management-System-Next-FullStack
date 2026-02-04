"use client";

import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Palette, 
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  Sun,
  Moon,
  Accessibility,
  Type,
  Zap,
  Contrast
} from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTheme } from "@/context/ThemeContext";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function SettingsView({ user }) {
  const { theme, setThemeMode } = useTheme();
  const { fontSize, updateFontSize, reducedMotion, toggleReducedMotion, highContrast, toggleHighContrast, screenReaderOptimized, toggleScreenReaderOptimized } = useAccessibility();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  // Password Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    announcements: true,
    attendanceAlerts: false,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    language: "en",
    timezone: "UTC+7",
    dateFormat: "MM/DD/YYYY",
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
  };

  const handleAppearanceChange = (e) => {
    setAppearanceSettings({ ...appearanceSettings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "accessibility-settings", label: "Accessibility", icon: Accessibility },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#EBF4F6] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Settings
          </h1>
          <p className="text-[13px] font-medium text-slate-500">
            Manage your account preferences and configurations
          </p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-[13px] font-bold text-emerald-700">Settings saved successfully!</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ minHeight: '400px' }}>
              
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-slate-800">Profile Information</h2>
                      <p className="text-[12px] text-slate-500">Update your personal details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Password Settings */}
              {activeTab === "password" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <Lock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-slate-800">Change Password</h2>
                      <p className="text-[12px] text-slate-500">Update your password to keep your account secure</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-2">Password Requirements:</p>
                    <ul className="text-[12px] text-blue-600 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Includes at least one number</li>
                      <li>• Has at least one special character</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-slate-800">Notification Preferences</h2>
                      <p className="text-[12px] text-slate-500">Choose what updates you want to receive</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-[13px] font-bold text-slate-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Receive notifications for this activity
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(key)}
                          className={`relative w-12 h-6 rounded-full transition-all ${
                            value ? "bg-blue-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              value ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <Palette className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-slate-800">Appearance & Localization</h2>
                      <p className="text-[12px] text-slate-500">Customize how the app looks and feels</p>
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setThemeMode("light")}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          theme === "light"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-[13px] font-bold">Light</span>
                      </button>
                      <button
                        onClick={() => setThemeMode("dark")}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          theme === "dark"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="text-[13px] font-bold">Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      Language
                    </label>
                    <select
                      name="language"
                      value={appearanceSettings.language}
                      onChange={handleAppearanceChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="km">ភាសាខ្មែរ (Khmer)</option>
                      <option value="zh">中文 (Chinese)</option>
                      <option value="es">Español (Spanish)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Timezone</label>
                    <select
                      name="timezone"
                      value={appearanceSettings.timezone}
                      onChange={handleAppearanceChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="UTC+7">UTC+7 (Bangkok, Phnom Penh)</option>
                      <option value="UTC+8">UTC+8 (Singapore, Beijing)</option>
                      <option value="UTC-5">UTC-5 (New York)</option>
                      <option value="UTC+0">UTC+0 (London)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700">Date Format</label>
                    <select
                      name="dateFormat"
                      value={appearanceSettings.dateFormat}
                      onChange={handleAppearanceChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Accessibility Settings */}
              {activeTab === "accessibility-settings" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-teal-50 rounded-xl">
                      <User className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-slate-800">Accessibility</h2>
                      <p className="text-[12px] text-slate-500">Customize the experience to your needs</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Font Size */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-slate-400" />
                        <label className="text-[13px] font-bold text-slate-800">Font Size</label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["small", "medium", "large", "extra-large"].map((size) => (
                          <button
                            key={size}
                            onClick={() => updateFontSize(size)}
                            className={`px-4 py-3 rounded-xl border-2 transition-all ${
                              fontSize === size
                                ? "border-teal-500 bg-teal-50 text-teal-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <span className={`text-[13px] font-bold capitalize`}>
                              {size.replace("-", " ")}
                            </span>
                            <div className="mt-1 h-1 bg-current opacity-20 rounded-full w-1/2 mx-auto" style={{
                              transform: `scaleX(${size === "small" ? 0.7 : size === "medium" ? 1 : size === "large" ? 1.3 : 1.6})`
                            }} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      
                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <Zap className="w-4 h-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">Reduce Motion</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Disable animations and transitions</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleReducedMotion}
                          className={`relative w-12 h-6 rounded-full transition-all ${
                            reducedMotion ? "bg-teal-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              reducedMotion ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* High Contrast */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <Contrast className="w-4 h-4 text-slate-900" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">High Contrast Mode</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Increase contrast for better visibility</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleHighContrast}
                          className={`relative w-12 h-6 rounded-full transition-all ${
                            highContrast ? "bg-teal-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              highContrast ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Screen Reader Support */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                         <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <User className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">Screen Reader Support</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Optimize interface for screen readers</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleScreenReaderOptimized}
                          className={`relative w-12 h-6 rounded-full transition-all ${
                            screenReaderOptimized ? "bg-teal-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              screenReaderOptimized ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-emerald-50 rounded-xl">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-slate-800">Privacy & Security</h2>
                      <p className="text-[12px] text-slate-500">Manage your privacy and data settings</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="text-[13px] font-bold text-slate-800 mb-2">Profile Visibility</h3>
                      <p className="text-[12px] text-slate-500 mb-3">Control who can see your profile information</p>
                      <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
                        <option>Everyone in the school</option>
                        <option>Only my classes</option>
                        <option>Only administrators</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="text-[13px] font-bold text-slate-800 mb-2">Data Export</h3>
                      <p className="text-[12px] text-slate-500 mb-3">Download a copy of your data</p>
                      <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-[12px] font-bold hover:bg-slate-50 transition-all">
                        Request Data Export
                      </button>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <h3 className="text-[13px] font-bold text-red-800 mb-2">Danger Zone</h3>
                      <p className="text-[12px] text-red-600 mb-3">Permanently delete your account and all associated data</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-[12px] font-bold hover:bg-red-700 transition-all">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="xs" color="white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
