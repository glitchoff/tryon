'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { pins } from '@/db/pin';
// Mock clothing suggestions
const clothingSuggestions = [
  {
    id: 1,
    name: 'Casual Denim Jacket',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    category: 'Outerwear',
    gender: 'Unisex',
  },
  {
    id: 2,
    name: 'Floral Summer Dress',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    category: 'Dresses',
    gender: 'Female',
  },
  {
    id: 3,
    name: 'Tailored Blazer',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    category: 'Formal',
    gender: 'Male',
  },
  {
    id: 4,
    name: 'Athletic Hoodie',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    category: 'Sportswear',
    gender: 'Unisex',
  },
];

// Mock avatars for demo
const demoAvatars = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&q=80',
    name: 'User 1',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    name: 'User 2',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
    name: 'User 3',
  },
];

// Pinterest pins array


export default function HomePage() {
  // Pinterest Filters State
  const [genderFilter, setGenderFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Unique categories from pins array
  const categories = Array.from(new Set(pins.map(pin => pin.category)));

  // Filter pins by gender, category, and search
  const filteredPins = pins.filter(pin => {
    const genderMatch = genderFilter === 'All' || pin.gender === genderFilter;
    const categoryMatch = categoryFilter === 'All' || pin.category === categoryFilter;
    const searchMatch =
      !searchQuery ||
      (pin.title && pin.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pin.alt && pin.alt.toLowerCase().includes(searchQuery.toLowerCase()));
    return genderMatch && categoryMatch && searchMatch;
  });

  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('styleAIProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        const filteredSuggestions = clothingSuggestions.filter(
          (item) => item.gender === 'Unisex' || item.gender === parsedProfile.sex
        );
        setSuggestions(filteredSuggestions);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  // Save profile to localStorage
  const saveProfile = (newProfile) => {
    try {
      localStorage.setItem('styleAIProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
      const filteredSuggestions = clothingSuggestions.filter(
        (item) => item.gender === 'Unisex' || item.gender === newProfile.sex
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-28 flex items-center justify-center overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-4 z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
            {profile ? `Welcome Back, ${profile.name}!` : 'Unleash Your Style with StyleAI'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Transform your fashion experience with our AI-powered virtual try-on. Discover outfits tailored just for you.
          </p>
          <Link
            href="/tryon"
            className="inline-block px-10 py-4 bg-white text-purple-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition transform hover:scale-105 animate-pulse"
          >
            Try It Now
          </Link>
        </div>
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" fill="none" viewBox="0 0 1200 600">
            <circle cx="150" cy="150" r="200" stroke="white" strokeWidth="10" />
            <circle cx="1050" cy="450" r="250" stroke="white" strokeWidth="10" />
          </svg>
        </div>
      </section>

      {/* Pinterest-style Pins Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Trending Pinterest Pins
        </h2>
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Gender Filter */}
          <div className="flex gap-2 justify-center">
            {['All', 'Male', 'Female'].map(gender => (
              <button
                key={gender}
                className={`px-4 py-2 rounded-full font-medium border transition ${
                  genderFilter === gender
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-100'
                }`}
                onClick={() => setGenderFilter(gender)}
              >
                {gender}
              </button>
            ))}
          </div>
          {/* Category Tabs */}
          <div className="flex gap-2 justify-center flex-wrap">
            {['All', ...categories].map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium border transition ${
                  categoryFilter === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-100'
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Search Bar */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search pins..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ minWidth: 200 }}
            />
          </div>
        </div>
        {/* Pins Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 [column-fill:_balance]">
          {filteredPins.map((pin, idx) => (
            <div
              key={idx}
              className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 w-full max-w-xs mx-auto"
            >
              <div className="relative group">
                <Link href={`/tryon?q=${encodeURIComponent(pin.src)}`}>
                  <Image
                    src={pin.src}
                    alt={pin.alt || `Pin ${idx + 1}`}
                    width={400}
                    height={533}
                    className="w-full object-cover group-hover:opacity-80 transition-opacity"
                    style={{ aspectRatio: '3/4', background: '#eee' }}
                    loading="lazy"
                  />
                </Link>
                <Link
                  href={`/tryon?q=${encodeURIComponent(pin.src)}`}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-md"
                >
                  Try On
                </Link>
              </div>
              {pin.title && (
                <div className="p-3 border-t border-gray-100 text-center">
                  <span className="text-gray-400 font-medium"></span><span className="text-base font-semibold text-gray-700">{pin.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          See It In Action
        </h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Explore how our virtual try-on brings outfits to life with these demo avatars.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <div className="relative h-64 group">
                <Image
                  src={avatar.image}
                  alt={avatar.name}
                  fill
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
                <Image
                  src={clothingSuggestions[avatar.id % clothingSuggestions.length].image}
                  alt="Clothing"
                  fill
                  className="absolute inset-0 w-full h-full object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
                <Link
                  href={`/tryon?q=${encodeURIComponent(clothingSuggestions[avatar.id % clothingSuggestions.length].image)}`}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-md"
                >
                  Try On
                </Link>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">{avatar.name}’s Try-On</h3>
                <p className="text-gray-600">
                  Wearing: {clothingSuggestions[avatar.id % clothingSuggestions.length].name}
                </p>
                <Link
                  href="/tryon"
                  className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Try Your Own
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clothing Suggestions */}
      {profile && (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Personalized Clothing Suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div className="relative group">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    loading="lazy"
                  />
                  <Link
                    href={`/tryon?q=${encodeURIComponent(item.image)}`}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-md"
                  >
                    Try On
                  </Link>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">{item.category}</p>
                  <Link
                    href="/tryon"
                    className="mt-3 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Try On
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>© 2025 StyleAI. All rights reserved.</p>
      </footer>
    </div>
  );
}