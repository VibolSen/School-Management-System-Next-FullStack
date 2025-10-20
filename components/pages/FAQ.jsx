
import { HelpCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
  );
}
