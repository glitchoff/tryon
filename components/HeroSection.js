import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-500/90 -z-10"></div>
      <div className="absolute inset-0 opacity-10 -z-10">
        <svg className="w-full h-full" viewBox="0 0 1200 600">
          <defs>
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-6 drop-shadow-lg" style={{ visibility: "visible" }}>
          Discover Your Style Instantly
        </h1>
        <p className="text-xl md:text-2xl text-purple-600 mb-8 font-medium" style={{ visibility: "visible" }}>
          Join thousands of fashion enthusiasts who are discovering their perfect style with our AI-powered virtual try-on.
        </p>
        <Link
          href="/tryon"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
        >
          Get Started Now
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
