'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


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

export default function HomePage() {
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
              <div className="relative h-64">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <img
                  src={clothingSuggestions[avatar.id % clothingSuggestions.length].image}
                  alt="Clothing"
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
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
                <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
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