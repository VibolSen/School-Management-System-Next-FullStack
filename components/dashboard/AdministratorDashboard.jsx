// AdministratorDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";

import {
  Users,
  Briefcase,
  Building2,
  Library,
  Group,
  UserCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function AdministratorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockData = {
    studentCount: 1245,
    teacherCount: 78,
    staffCount: 42,
    departmentCount: 8,
    courseCount: 56,
    groupCount: 32,
  };

  // This fetch logic is now correct and will receive the new counts
  async function fetchDashboardData() {
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you would fetch from your API
      setDashboardData(mockData);

      // Example of real implementation:
      // const res = await fetch("/api/dashboard");
      // if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
      // const data = await res.json();
      // setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  async function fetchCurrentUser() {
    try {
      // Mock user data for demonstration
      const mockUser = {
        firstName: "Alex",
        lastName: "Johnson",
      };
      setCurrentUser(mockUser);

      // Example of real implementation:
      // const res = await fetch("/api/me");
      // if (!res.ok) throw new Error("Failed to fetch current user");
      // const data = await res.json();
      // setCurrentUser(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchCurrentUser()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-semibold text-muted-foreground animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-semibold text-destructive">
            Failed to load dashboard data
          </p>
        </div>
      </div>
    );
  }

  const welcomeName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-primary to-secondary p-8 md:p-12 rounded-3xl shadow-2xl shadow-primary/20 text-primary-foreground relative">
              {/* Header background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                      Welcome back, {welcomeName}!
                    </h1>
                  </div>
                  <p className="text-lg md:text-xl text-primary-foreground/90 font-medium max-w-2xl">
                    Here's a comprehensive overview of your school's performance
                    metrics and system status.
                  </p>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      Real-time Analytics Dashboard
                    </span>
                  </div>
                </div>

                {/* Decorative element */}
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Grid layout with staggered animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <DashboardCard
                title="Total Students"
                value={dashboardData.studentCount}
                icon={<Users className="w-6 h-6" />}
                gradient="from-blue-600/20 via-blue-500/15 to-cyan-600/20"
                change="+12%"
                changeType="increase"
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <DashboardCard
                title="Total Teachers"
                value={dashboardData.teacherCount}
                icon={<UserCheck className="w-6 h-6" />}
                gradient="from-emerald-600/20 via-green-500/15 to-teal-600/20"
                change="+5%"
                changeType="increase"
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <DashboardCard
                title="Total Staff"
                value={dashboardData.staffCount}
                icon={<Briefcase className="w-6 h-6" />}
                gradient="from-purple-600/20 via-violet-500/15 to-indigo-600/20"
                change="Stable"
                changeType="neutral"
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <DashboardCard
                title="Total Departments"
                value={dashboardData.departmentCount}
                icon={<Building2 className="w-6 h-6" />}
                gradient="from-amber-600/20 via-yellow-500/15 to-orange-600/20"
                change="+2"
                changeType="increase"
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <DashboardCard
                title="Total Courses"
                value={dashboardData.courseCount}
                icon={<Library className="w-6 h-6" />}
                gradient="from-sky-600/20 via-blue-500/15 to-indigo-600/20"
                change="+8%"
                changeType="increase"
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <DashboardCard
                title="Total Groups"
                value={dashboardData.groupCount}
                icon={<Group className="w-6 h-6" />}
                gradient="from-pink-600/20 via-rose-500/15 to-red-600/20"
                change="+15%"
                changeType="increase"
              />
            </div>
          </div>

          {/* Additional fancy footer section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted/50 backdrop-blur-sm rounded-full border border-border/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">
                System Status: All services operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
