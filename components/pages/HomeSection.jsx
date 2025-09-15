// components/HomeSection.jsx
import {
  Briefcase,
  Users,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Code,
  Smartphone,
  Palette,
  Database,
  Shield,
  Megaphone,
} from "lucide-react";

export default function HomeSection() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-24 right-16 w-14 h-14 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-lg rotate-45 blur-lg animate-bounce" />
        <div className="absolute bottom-16 left-1/3 w-10 h-10 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-md animate-pulse delay-1000" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full border border-blue-200/50 mb-6 shadow-lg backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide">
              Empowering Global Education
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 text-balance leading-tight">
            Transform Your Learning Journey
          </h1>
          <p className="text-lg text-slate-600 max-w-4xl mx-auto text-balance leading-relaxed font-medium">
            We are passionate about empowering learners worldwide with
            high-quality, accessible & engaging education that opens doors to
            endless possibilities.
          </p>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3" />
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-200/50 mb-6 shadow-lg backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">
                Our Global Impact
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-blue-900 bg-clip-text text-transparent mb-6 text-balance">
              Trusted by Thousands Worldwide
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Join our thriving community of learners and educators making a
              difference across the globe.
            </p>
          </div>

          {/* Fancy Stats Grid */}
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Card 1: Instructors */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse" />

              <div className="relative flex flex-col items-center p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-blue-500/25 group-hover:-translate-y-1">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Briefcase className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-500">
                  25+
                </div>

                <div className="text-slate-700 font-semibold text-center text-xs">
                  Professional Instructors
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100" />
                </div>
              </div>
            </div>

            {/* Card 2: Students */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-300" />

              <div className="relative flex flex-col items-center p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-emerald-500/25 group-hover:-translate-y-1">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-xl group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Users className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-500">
                  10K+
                </div>

                <div className="text-slate-700 font-semibold text-center text-xs">
                  Happy Students
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-100" />
                </div>
              </div>
            </div>

            {/* Card 3: Courses */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-600" />

              <div className="relative flex flex-col items-center p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-purple-500/25 group-hover:-translate-y-1">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <BookOpen className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-500">
                  50+
                </div>

                <div className="text-slate-700 font-semibold text-center text-xs">
                  Premium Courses
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 mb-6 shadow-lg backdrop-blur-sm">
              <Award className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="text-xs font-semibold text-purple-700 tracking-wide">
                Explore Categories
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6 text-balance">
              Popular Learning Categories
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Discover courses across various domains to enhance your skills and
              advance your career.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Web Development */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse" />

              <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-blue-500/25 group-hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Code className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors duration-300">
                    Web Development
                  </h3>
                  <p className="text-xs text-slate-600">12 Courses</p>
                </div>
              </div>
            </div>

            {/* Mobile Development */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-200" />

              <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-emerald-500/25 group-hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-xl group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Smartphone className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors duration-300">
                    Mobile Development
                  </h3>
                  <p className="text-xs text-slate-600">8 Courses</p>
                </div>
              </div>
            </div>

            {/* UI/UX Design */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-400" />

              <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-purple-500/25 group-hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Palette className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-purple-600 transition-colors duration-300">
                    UI/UX Design
                  </h3>
                  <p className="text-xs text-slate-600">10 Courses</p>
                </div>
              </div>
            </div>

            {/* Data Science */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-600" />

              <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-rose-500/25 group-hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl shadow-xl group-hover:shadow-rose-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Database className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors duration-300">
                    Data Science
                  </h3>
                  <p className="text-xs text-slate-600">15 Courses</p>
                </div>
              </div>
            </div>

            {/* Cybersecurity */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-800" />

              <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-indigo-500/25 group-hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Shield className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors duration-300">
                    Cybersecurity
                  </h3>
                  <p className="text-xs text-slate-600">7 Courses</p>
                </div>
              </div>
            </div>

            {/* Digital Marketing */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-1000" />

              <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-amber-500/25 group-hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-xl group-hover:shadow-amber-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Megaphone className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors duration-300">
                    Digital Marketing
                  </h3>
                  <p className="text-xs text-slate-600">9 Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
