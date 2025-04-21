// components/HeaderSection.jsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";

export default function HeaderSection({ profile, clothingSuggestions }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-500/90 -z-10"></div>
      <div className="absolute inset-0 opacity-10 -z-10">
        <svg className="w-full h-full" viewBox="0 0 1200 600">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {profile ? (
                <div className="text-black">
                  Welcome Back, <span className="text-pink-300">{profile.name}!</span>
                </div>
              ) : (
                <div className="text-black">
                  Discover Your <span className="text-blue-300">Perfect Style</span>
                </div>
              )}
            </h1>
            <p className="text-lg md:text-xl text-black mb-8 max-w-lg mx-auto md:mx-0">
              Transform your fashion experience with our AI-powered virtual try-on. Discover outfits tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/tryon"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
              >
                Try It Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white/10 transition"
              >
                Explore Styles
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-400/30 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-400/30 rounded-full filter blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                {clothingSuggestions.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="relative group overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={200}
                      height={250}
                      className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                      <p className="text-sm font-medium">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-yellow-300" />
                    Try on now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
}