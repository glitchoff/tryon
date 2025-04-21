// components/PersonalizedSection.jsx
import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, ChevronRight, ArrowRight } from "lucide-react";

export default function PersonalizedSection({ suggestions }) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-3">
            Just For You
          </span>
          <h2 className="text-3xl font-bold text-black mb-4">Personalized Recommendations</h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Based on your style preferences, we’ve curated these looks just for you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                    <Heart className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                  <Link
                    href={`/tryon?q=${encodeURIComponent(item.image)}`}
                    className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-black py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Try On
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-black">{item.name}</h3>
                <p className="text-sm text-black mt-1">{item.category}</p>
                <div className="mt-4">
                  <Link
                    href={`/tryon?q=${encodeURIComponent(item.image)}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-black hover:bg-purple-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-black rounded-full hover:bg-gray-50 transition shadow-sm"
          >
            Explore More Styles
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}