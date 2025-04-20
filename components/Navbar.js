'use client';

import Link from 'next/link';

export default function Navbar({ profile, onProfileClick }) {
  return (
    <nav className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-3xl font-extrabold text-purple-600 tracking-tight">
        StyleAI
      </Link>
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition">
          Home
        </Link>
        <Link href="/tryon" className="text-gray-700 hover:text-purple-600 font-medium transition">
          Try-On
        </Link>
        {profile ? (
          <div className="flex items-center gap-3 cursor-pointer" onClick={onProfileClick}>
            <img
              src={profile.image || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
            />
            <span className="text-gray-700 font-medium">{profile.name}</span>
          </div>
        ) : (
          <button
            onClick={onProfileClick}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Create Profile
          </button>
        )}
      </div>
    </nav>
  );
}