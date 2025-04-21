// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import { pins } from "@/db/pin";
import HeaderSection from "../components/HeaderSection";
import SearchBar from "../components/SearchBar";
import FilterSection from "../components/FilterSection";
import PinsGrid from "../components/PinsGrid";
import DemoSection from "../components/DemoSection";
import PersonalizedSection from "../components/PersonalizedSection";
import GeminiChatbot from "../components/GeminiChatbot";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

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
];

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
];

export default function HomePage() {
  // Pinterest Filters State
  const [genderFilter, setGenderFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Unique categories from pins array
  const categories = Array.from(new Set(pins.map((pin) => pin.category)));

  // Filter pins by gender, category, and search
  const filteredPins = pins.filter((pin) => {
    const genderMatch = genderFilter === "All" || pin.gender === genderFilter;
    const categoryMatch = categoryFilter === "All" || pin.category === categoryFilter;
    const searchMatch =
      !searchQuery ||
      (pin.title && pin.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pin.alt && pin.alt.toLowerCase().includes(searchQuery.toLowerCase()));
    return genderMatch && categoryMatch && searchMatch;
  });

  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("styleAIProfile");
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        const filteredSuggestions = clothingSuggestions.filter(
          (item) => item.gender === "Unisex" || item.gender === parsedProfile.sex
        );
        setSuggestions(filteredSuggestions);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save profile to localStorage
  const saveProfile = (newProfile) => {
    try {
      localStorage.setItem("styleAIProfile", JSON.stringify(newProfile));
      setProfile(newProfile);
      const filteredSuggestions = clothingSuggestions.filter(
        (item) => item.gender === "Unisex" || item.gender === newProfile.sex
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      <HeaderSection profile={profile} clothingSuggestions={clothingSuggestions} />
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Trending Styles</h2>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
          />
        </div>
        <FilterSection
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          categories={categories}
        />
        <PinsGrid filteredPins={filteredPins} />
      </section>
      <DemoSection demoAvatars={demoAvatars} clothingSuggestions={clothingSuggestions} />
      {profile && <PersonalizedSection suggestions={suggestions} />}
      <HeroSection />
      <Footer />
      <GeminiChatbot />
    </div>
  );
}