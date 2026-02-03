// app/(auth)/login/page.jsx
"use client";

import { useState } from "react";
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
      }

      const roleName = data?.user?.role?.toLowerCase() || "";

      if (roleName === "admin") window.location.href = "/admin/dashboard";
      else if (roleName === "hr") window.location.href = "/hr/dashboard";
      else if (roleName === "study-office" || roleName === "study_office")
        window.location.href = "/study-office/dashboard";
      else if (roleName === "faculty")
        window.location.href = "/faculty/dashboard";
      else if (roleName === "teacher")
        window.location.href = "/teacher/dashboard";
      else if (roleName === "student")
        window.location.href = "/student/dashboard";
      else window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-4 text-slate-700 w-full flex flex-col items-center">
            <h2 className="text-3xl font-black text-balance max-w-md tracking-tight leading-tight">
              Welcome Back to Your Educational Journey!
            </h2>
            <p className="text-lg text-slate-500 text-pretty max-w-md font-medium">
              Continue your learning experience with thousands of students
              transforming their future.
            </p>
          </div>
          <div className="relative flex justify-center transform hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
            <img
              src="/illustration/login.png"
              alt="Student logging in"
              className="w-80 h-80 object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mr-auto lg:ml-0">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Login to Your Account
              </h2>
              <p className="text-[13px] text-slate-500 mt-2 font-medium">
                Enter your credentials to continue learning
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-[13px] font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-[13px] font-medium"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 transition-all"
                  />
                  <span className="group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-[13px] uppercase tracking-wide ${
                  isLoading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="xs" color="slate" className="mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">
                Or continue with
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-[#166FE5] transition-all shadow-lg shadow-blue-500/20">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-[13px] text-slate-500 font-medium">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
