"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Facebook,
  Send,
  Github,
  Youtube,
  Heart,
  Star,
  Users,
  Target,
  Sparkles,
  School,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Linkedin,
} from "lucide-react";

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 50 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const teamMembers = [
    {
      name: "Mr. Sen Vibol",
      image: "/profile.jpg",
      role: "Full-Stack Developer",
      description:
        "Passionate about creating robust, scalable systems to streamline educational administration.",
      social: {
        facebook: "https://www.facebook.com/vibolsen02",
        telegram: "https://t.me/vibolsen",
        github: "https://github.com/VibolSen",
        linkedin: "#",
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 text-blue-200 dark:text-blue-800"
        >
          <School size={40} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-40 right-20 text-indigo-200 dark:text-indigo-800"
          style={{ animationDelay: "1s" }}
        >
          <GraduationCap size={35} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-40 left-20 text-purple-200 dark:text-purple-800"
          style={{ animationDelay: "2s" }}
        >
          <BookOpen size={30} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-20 right-10 text-blue-200 dark:text-blue-800"
          style={{ animationDelay: "3s" }}
        >
          <Lightbulb size={25} />
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto p-6 md:p-8 lg:p-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section
          className="text-center py-20 relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl opacity-90 dark:opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>

          <div className="relative z-10 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg"
            >
              <Target className="w-4 h-4" />
              About Our Mission
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                EduSys
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Empowering educational institutions with a seamless, integrated,
              and powerful management solution.
            </motion.p>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section className="py-20" variants={itemVariants}>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4 shadow-lg"
            >
              <Users className="w-4 h-4" />
              Meet Our Team
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Architects of EduSys
            </h2>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-12">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl transition-all duration-500 border border-gray-200 dark:border-gray-700">
                    <div className="relative mb-6 w-32 h-32 mx-auto">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="rounded-full w-full h-full object-cover border-4 border-white dark:border-gray-700"
                      />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-center">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 text-center">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                      {member.description}
                    </p>

                    <div className="flex justify-center gap-4">
                      <motion.a
                        href={member.social.facebook}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 bg-blue-500 text-white rounded-full"
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={member.social.telegram}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 bg-blue-500 text-white rounded-full"
                      >
                        <Send className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={member.social.github}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={member.social.linkedin}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Vision Section */}
        <motion.section className="py-20" variants={itemVariants}>
          <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 p-12 rounded-3xl relative">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg"
              >
                <Target className="w-4 h-4" />
                Our Vision
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Revolutionizing School Administration
              </h2>
              <p className="text-lg mb-8">
                We are committed to building a reliable and user-friendly
                platform for modern education.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default AboutUs;
