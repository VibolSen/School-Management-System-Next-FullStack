"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  User,
  BookText,
  MessageSquare,
  Send,
  Facebook,
  Github,
  Youtube,
  Sparkles,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Removed TypeScript type annotations for .jsx compatibility
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Removed TypeScript type annotations for .jsx compatibility
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to an API)
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 text-blue-200 dark:text-blue-800"
        >
          <Mail size={40} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-60 right-20 text-indigo-200 dark:text-indigo-800"
          style={{ animationDelay: "1.5s" }}
        >
          <MessageSquare size={35} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-40 left-20 text-purple-200 dark:text-purple-800"
          style={{ animationDelay: "2.5s" }}
        >
          <Phone size={30} />
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto p-6 md:p-8 lg:p-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.section
          className="text-center py-16"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            We're Here to Help
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800  mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a question, feedback, or need support? We'd love to hear
            from you. Reach out and let's talk.
          </p>
        </motion.section>

        {/* Main Content: Form and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            className="bg-white  dark:bg-white rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold text-blue-800 dark:text-white mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 " />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border dark:border-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:border-gray-700 border border-gray-200  rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Subject Input */}
              <div className="relative">
                <BookText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:border-gray-700 border border-gray-200  rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-5 w-5 h-5 text-gray-400" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:border-gray-700border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Details & Map */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="bg-white  rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-blue-900   mb-6">
                Contact Information
              </h2>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <span>
                    Russian Federation Blvd (110), Phnom Penh, Cambodia
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <a
                    href="mailto:support@edusys.com"
                    className="hover:text-blue-500 transition-colors"
                  >
                    vibolsen2002@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <a
                    href="tel:+85512345678"
                    className="hover:text-blue-500 transition-colors"
                  >
                    (+855) 966845795
                  </a>
                </li>
              </ul>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 flex justify-center gap-4">
                <motion.a href="#" aria-label="Facebook" whileHover={{ scale: 1.1 }}><Facebook className="w-6 h-6 text-gray-500 hover:text-blue-600 transition-colors" /></motion.a>
                <motion.a href="#" aria-label="GitHub" whileHover={{ scale: 1.1 }}><Github className="w-6 h-6 text-gray-500 hover:text-black dark:hover:text-white transition-colors" /></motion.a>
                <motion.a href="#" aria-label="YouTube" whileHover={{ scale: 1.1 }}><Youtube className="w-6 h-6 text-gray-500 hover:text-red-600 transition-colors" /></motion.a>
              </div>
            </div>

            <div className="bg-white   rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="overflow-hidden rounded-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.784220372338!2d104.89069731526113!3d11.56734334731053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519fe4077d69%3A0x0!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1672345678901!5m2!1sen!2skh"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="School Location"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;