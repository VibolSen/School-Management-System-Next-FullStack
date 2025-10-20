
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Student Management",
      description:
        "Easily manage student information, track progress, and communicate with students and parents.",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-purple-500" />,
      title: "Course Management",
      description:
        "Create and manage courses, assign teachers, and track course progress and performance.",
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-pink-500" />,
      title: "Faculty Management",
      description:
        "Manage faculty information, track performance, and communicate with faculty members.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Features
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Explore the powerful features that make our platform the best choice for your institution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
