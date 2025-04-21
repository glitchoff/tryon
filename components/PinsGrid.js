// components/PinsGrid.jsx
import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, ChevronRight } from "lucide-react";

export default function PinsGrid({ filteredPins }) {
  return (
    <>
      <div className="mb-6 text-sm text-gray-500">
        Showing {filteredPins.length} {filteredPins.length === 1 ? "result" : "results"}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {filteredPins.map((pin, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Link href={`/tryon?q=${encodeURIComponent(pin.src)}`}>
                <Image
                  src={pin.src || "/placeholder.svg"}
                  alt={pin.alt || `Pin ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <div className="absolute top-2 right-2 z-10">
                <button className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                  <Heart className="w-4 h-4 text-pink-500" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <Link
                  href={`/tryon?q=${encodeURIComponent(pin.src)}`}
                  className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Try On
                </Link>
              </div>
            </div>
            {pin.title && (
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">{pin.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {pin.gender} · {pin.category}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition shadow-sm">
          Load More
          <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </>
  );
}