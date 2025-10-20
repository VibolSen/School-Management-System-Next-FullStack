
import { Send } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-lg text-white leading-relaxed mb-8">
            Discover how EduSys can streamline your operations and enhance your institution's efficiency.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 shadow-lg">
            <Send className="w-5 h-5" />
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  );
}
