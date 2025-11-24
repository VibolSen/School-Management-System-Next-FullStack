// components/HomePage.jsx
"use client";


import { useState, useEffect } from "react";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Partners from "./Partners";
import FAQ from "./FAQ";

export default function HomePage() {


  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">


      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 px-8 lg:px-32">
        <div className="absolute top-16 left-16 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-24 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-lg rotate-45 blur-lg animate-bounce" />
        <div className="absolute bottom-24 left-1/4 w-14 h-14 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-md animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-2xl lg:text-6xl font-black text-blue-900 text-balance leading-tight">
                Smart Learning
                <br />
                <span className="text-slate-800">Deeper & More</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Amazing
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg text-pretty leading-relaxed font-medium">
                Transform your skills with our comprehensive online courses
                designed for modern learners. Join thousands of students already
                advancing their careers with cutting-edge education.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
              </div>
            </div>

            <div className="relative w-full max-w-md mx-auto">
              {/* Multiple glow layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-r from-blue-300/15 via-purple-300/15 to-pink-300/15 rounded-2xl blur-2xl animate-pulse delay-500" />

              <div>
                <img
                  src="/illustration/Coding workshop.gif"
                  alt="Student learning online"
                  // className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>

              {/* Floating elements around the image */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg" />
              <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-300 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />



      {/* Partners Section */}
      <Partners />

      {/* FAQ Section */}
      <FAQ />




    </div>
  );
}
