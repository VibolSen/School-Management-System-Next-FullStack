// app/(auth)/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(
          "Welcome to our learning community! Registration successful!"
        );
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6 order-2 lg:order-1">
          <div className="space-y-4 text-slate-700 w-full flex flex-col items-center">
            <h2 className="text-3xl font-black text-balance max-w-md tracking-tight leading-tight">
              Welcome to Your Educational Journey!
            </h2>
            <p className="text-lg text-slate-500 text-pretty max-w-md font-medium">
              Join thousands of students who are already transforming their
              future through quality education.
            </p>
          </div>
          <div className="relative flex justify-center transform hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
            <img
              src="/illustration/signUp.png"
              alt="Students learning together"
              className="w-80 h-80 object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 order-1 lg:order-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Create a New Account
              </h2>
              <p className="text-[13px] text-slate-500 mt-2 font-medium">
                Enter your details to get started
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{success} Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name Field */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      placeholder="John"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-[13px] font-medium"
                    />
                  </div>
                </div>
                {/* Last Name Field */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                    Last Name
                  </label>
                  <div className="relative group">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Doe"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-[13px] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-[13px] font-medium"
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

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-[13px] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !!success}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-[13px] uppercase tracking-wide mt-2 ${
                  loading || success
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="xs" color="slate" className="mr-2" />
                    Creating Account...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Success!
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    Register
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-[13px] text-slate-500 font-medium">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors hover:underline"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
