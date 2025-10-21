import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-100 p-6 flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Left Side: Text Information */}
        <div className="md:flex-1 text-center md:text-left md:pr-10">
          <h2 className="mt-4 text-9xl font-bold text-gray-800 animate-bounce">
            404
          </h2>
          <h3 className="mt-4 text-3xl font-semibold text-gray-700">
            Oops! Page Not Found
          </h3>
          <p className="mt-2 text-lg text-gray-600 max-w-md">
            It looks like you&apos;ve wandered off the path. Don&apos;t worry, we&apos;ll help
            you find your way back!
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Go Back Home
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="md:flex-1 mt-10 md:mt-0 animate-float">
          <Image
            src="/404 error.svg" // Replace with the correct path to your image
            alt="404 illustration"
            width={500} // Set the width of the image
            height={350} // Set the height of the image (adjust as needed)
            className="w-full h-auto max-w-lg" // Use CSS to control the responsive behavior
          />
        </div>
      </div>
    </div>
  );
}