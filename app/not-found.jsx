import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-100 p-6 flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Left Side: Text Information */}
        <div className="md:flex-1 text-center md:text-left md:pr-10">
          <h2 className="mt-4 text-3xl font-bold text-gray-800 animate-bounce">
            I'm Not yet done!😭
          </h2>
          <h3 className="mt-4 text-2xl font-semibold text-gray-700">
            Please wait a moment...😭
          </h3>
          <p className="mt-2 text-lg text-gray-600 max-w-md">
            It looks like you&apos;ve wandered off the path. Don&apos;t worry,
            we&apos;ll help you find your way back!
          </p>
          <div className="mt-8"></div>
        </div>

        {/* Right Side: Image */}
        <div className="md:flex-1 mt-10 md:mt-0 animate-float">
          <Image
            src="/404.png" // Ensure the path to your image is correct (usually in /public)
            alt="404 illustration"
            width={500}
            height={350}
            className="w-full h-auto max-w-lg"
          />
        </div>
      </div>
    </div>
  );
}
