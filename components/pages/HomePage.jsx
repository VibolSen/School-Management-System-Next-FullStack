// components/HomePage.jsx
"use client";

import { HelpCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import HomeSection from "./HomeSection";

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${10 + Math.random() * 15}s`,
      animationDelay: `${Math.random() * 10}s`,
      size: Math.random() > 0.5 ? "w-1 h-1" : "w-0.5 h-0.5",
    }));
    setParticles(generated);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I get started with your platform?",
      answer:
        "Simply sign up for a free account, browse our course catalog, and enroll in the courses that interest you. You can start learning immediately after enrollment.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 7-day free trial for new users. You can access selected courses and features to experience our platform before committing to a subscription.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers.",
    },
    {
      question: "Do you provide certificates upon completion?",
      answer:
        "Yes, we provide verified certificates for all completed courses. These certificates can be shared on LinkedIn and added to your professional portfolio.",
    },
    {
      question: "Is my data secure with your platform?",
      answer:
        "We take data security very seriously. All user data is encrypted and stored securely. We comply with international data protection standards and never share your information with third parties.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Enhanced Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className={`absolute ${p.size} bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-full animate-pulse`}
            style={{
              top: p.top,
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>

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
                <button className="group relative px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/25 transition-all duration-500 hover:scale-105 hover:shadow-blue-500/40">
                  <span className="relative z-10 text-base">
                    Start Learning Today
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl" />
                </button>
                <button className="px-7 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg text-base">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative w-full max-w-md mx-auto">
              {/* Multiple glow layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-r from-blue-300/15 via-purple-300/15 to-pink-300/15 rounded-2xl blur-2xl animate-pulse delay-500" />

              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/50">
                <img
                  src="/illustration/Coding workshop.gif"
                  alt="Student learning online"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>

              {/* Floating elements around the image */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg" />
              <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-300 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div>
          <HomeSection />
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 relative overflow-hidden">
        <div className="absolute top-16 left-16 w-28 h-28 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Enhanced Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 mb-6 shadow-lg backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="text-xs font-semibold text-purple-700 tracking-wide">
                Got Questions?
              </span>
            </div>
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Find answers to common questions about our platform and courses.
            </p>
          </div>

          {/* Enhanced FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-2 rounded-2xl shadow-lg transition-all duration-500 overflow-hidden backdrop-blur-sm
                  ${
                    openFaqIndex === index
                      ? "bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200 shadow-purple-500/20"
                      : "bg-white/80 border-slate-200 hover:border-purple-300"
                  }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full text-left p-6 font-bold group"
                >
                  <span className="text-lg flex text-slate-800 items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={`h-5 w-5 transform transition-transform duration-300 text-slate-600 group-hover:text-purple-500
                      ${openFaqIndex === index ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Answer Section */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaqIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
