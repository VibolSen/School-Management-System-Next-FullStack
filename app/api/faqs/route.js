import { NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json(faqs);
}
