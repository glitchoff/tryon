// components/DemoSection.jsx
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export default function DemoSection({ demoAvatars, clothingSuggestions }) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See It In Action</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore how our virtual try-on brings outfits to life with these demo avatars.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  wet
                  src={avatar.image || "/placeholder.svg"}
                  alt={avatar.name}
                  fill
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <Image
                    src={clothingSuggestions[avatar.id % clothingSuggestions.length].image || "/placeholder.svg"}
                    alt="Clothing"
                    fill
                    className="object-contain p-8 transform group-hover:scale-95 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Link
                    href={`/tryon?q=${encodeURIComponent(clothingSuggestions[avatar.id % clothingSuggestions.length].image)}`}
                    className="px-6 py-2.5 bg-white/90 backdrop-blur-sm text-purple-600 rounded-full font-medium hover:bg-white transition-colors shadow-lg transform group-hover:translate-y-0 translate-y-12 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <span className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try This Look
                    </span>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{avatar.name}&#39;s Look</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Wearing: {clothingSuggestions[avatar.id % clothingSuggestions.length].name}
                </p>
                <Link
                  href="/tryon"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Try Your Own Look
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}