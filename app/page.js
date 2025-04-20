"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { pins } from "@/db/pin"
import { Search, Heart, Sparkles, ChevronRight, Filter, X, ArrowRight, Zap } from "lucide-react"

// Mock clothing suggestions
const clothingSuggestions = [
  {
    id: 1,
    name: "Casual Denim Jacket",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    category: "Outerwear",
    gender: "Unisex",
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    category: "Dresses",
    gender: "Female",
  },
  {
    id: 3,
    name: "Tailored Blazer",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    category: "Formal",
    gender: "Male",
  },
  {
    id: 4,
    name: "Athletic Hoodie",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    category: "Sportswear",
    gender: "Unisex",
  },
]

// Mock avatars for demo
const demoAvatars = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&q=80",
    name: "User 1",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
    name: "User 2",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    name: "User 3",
  },
]

export default function HomePage() {
  // Pinterest Filters State
  const [genderFilter, setGenderFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Unique categories from pins array
  const categories = Array.from(new Set(pins.map((pin) => pin.category)))

  // Filter pins by gender, category, and search
  const filteredPins = pins.filter((pin) => {
    const genderMatch = genderFilter === "All" || pin.gender === genderFilter
    const categoryMatch = categoryFilter === "All" || pin.category === categoryFilter
    const searchMatch =
      !searchQuery ||
      (pin.title && pin.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pin.alt && pin.alt.toLowerCase().includes(searchQuery.toLowerCase()))
    return genderMatch && categoryMatch && searchMatch
  })

  const [profile, setProfile] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Load profile from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("styleAIProfile")
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
        const filteredSuggestions = clothingSuggestions.filter(
          (item) => item.gender === "Unisex" || item.gender === parsedProfile.sex,
        )
        setSuggestions(filteredSuggestions)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Save profile to localStorage
  const saveProfile = (newProfile) => {
    try {
      localStorage.setItem("styleAIProfile", JSON.stringify(newProfile))
      setProfile(newProfile)
      const filteredSuggestions = clothingSuggestions.filter(
        (item) => item.gender === "Unisex" || item.gender === newProfile.sex,
      )
      setSuggestions(filteredSuggestions)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      

      {/* Hero Section */}
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
                Transform your fashion experience with our AI-powered virtual try-on. Discover outfits tailored just for
                you.
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
                  <div className="flex -space-x-2">
                    {demoAvatars.map((avatar, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={avatar.image || "/placeholder.svg"}
                          alt={avatar.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
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

      {/* Pinterest-style Pins Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Trending Styles</h2>

          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? <X className="w-4 h-4 mr-2" /> : <Filter className="w-4 h-4 mr-2" />}
            {isFilterOpen ? "Close" : "Filters"}
          </button>

          {/* Search Bar */}
          <div
            className={`relative transition-all duration-300 ${isSearchFocused ? "w-full md:w-72" : "w-full md:w-64"}`}
          >
            <input
              type="text"
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters - Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Male", "Female"].map((gender) => (
                  <button
                    key={gender}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      genderFilter === gender
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setGenderFilter(gender)}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {["All", ...categories].map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      categoryFilter === category
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Desktop */}
        <div className="hidden md:flex md:flex-wrap md:items-center gap-3 mb-8">
          {/* Gender Filter */}
          <div className="flex gap-2">
            {["All", "Male", "Female"].map((gender) => (
              <button
                key={gender}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  genderFilter === gender
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setGenderFilter(gender)}
              >
                {gender}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === category
                    ? "bg-pink-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-500">
          Showing {filteredPins.length} {filteredPins.length === 1 ? "result" : "results"}
        </div>

        {/* Pins Grid */}
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

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition shadow-sm">
            Load More
            <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Demo Section */}
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
                  {/* Background Image */}
                  <Image
                    src={avatar.image || "/placeholder.svg"}
                    alt={avatar.name}
                    fill
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                  {/* Clothing Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <Image
                      src={clothingSuggestions[avatar.id % clothingSuggestions.length].image || "/placeholder.svg"}
                      alt="Clothing"
                      fill
                      className="object-contain p-8 transform group-hover:scale-95 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Try On Button */}
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
                    <h3 className="text-lg font-semibold text-gray-800">{avatar.name}'s Look</h3>
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

      {/* Clothing Suggestions */}
      {profile && (
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-3">
                Just For You
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Based on your style preferences, we've curated these looks just for you.
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
                        className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Try On
                      </Link>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    <div className="mt-4">
                      <Link
                        href={`/tryon?q=${encodeURIComponent(item.image)}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg text-sm font-medium transition-colors"
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
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition shadow-sm"
              >
                Explore More Styles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-500/90 -z-10"></div>
        <div className="absolute inset-0 opacity-10 -z-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <defs>
              <pattern
                id="pattern-circles-cta"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
                patternContentUnits="userSpaceOnUse"
              >
                <circle id="pattern-circle-cta" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Style Experience?</h2>
          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
            Join thousands of fashion enthusiasts who are discovering their perfect style with our AI-powered virtual
            try-on.
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StyleAI</h3>
              <p className="text-gray-400 mb-4">Transforming fashion with AI-powered virtual try-on technology.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 StyleAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
