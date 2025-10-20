// app/(auth)/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";
import Cookies from "js-cookie"; // You may need to install this: npm install js-cookie

import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter(); // Initialize useRouter
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

      // Set the token in a cookie for the middleware to use
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
      }

      // ✅ CORRECT: Get role from user data and redirect
      const roleName = data?.user?.role?.toLowerCase() || "";

      // Route based on role name
      if (roleName === "admin") router.push("/admin/dashboard");
      else if (roleName === "hr") router.push("/hr/dashboard");
      else if (roleName === "study-office") router.push("/study-office/dashboard");
      else if (roleName === "faculty") router.push("/faculty/dashboard");
      else if (roleName === "teacher") router.push("/teacher/dashboard");
      else if (roleName === "student") router.push("/student/dashboard");
      else router.push("/"); // Fallback to a default page
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-4">
          <div className="space-y-3 text-slate-700 w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-balance max-w-md">
              Welcome Back to Your Educational Journey!
            </h2>
            <p className="text-lg text-slate-600 text-pretty max-w-md">
              Continue your learning experience with thousands of students
              transforming their future.
            </p>
          </div>
          <div className="relative flex justify-center">
            <img
              src="/illustration/login.png"
              alt="Student logging in"
              className="w-80 h-80 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Login to Your Account
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter your credentials to continue learning
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Password
                </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-gray-600">
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  Remember me
                </label>
                <a
                  href="/forgot-password"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 text-sm ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Social and Footer sections remain the same... */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-500">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-xs py-2 rounded-md hover:bg-gray-50 transition-colors">
                {/* Google SVG */}
                Google
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-[#1877F2] text-white text-xs py-2 rounded-md hover:bg-[#166FE5] transition-colors">
                {/* Facebook SVG */}
                Facebook
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
