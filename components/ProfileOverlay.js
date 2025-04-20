'use client';

import { useState } from 'react';

export default function ProfileOverlay({ isOpen, onClose, onSave, existingProfile }) {
  const [preview, setPreview] = useState(existingProfile?.image || '');
  const [imageFile, setImageFile] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImageFile(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProfile = {
      image: imageFile || existingProfile?.image || '',
      name: formData.get('name'),
      sex: formData.get('sex'),
      age: parseInt(formData.get('age')),
      measurements: {
        height: parseFloat(formData.get('height')),
        chest: parseFloat(formData.get('chest')),
        waist: parseFloat(formData.get('waist')),
        hips: parseFloat(formData.get('hips')),
      },
    };
    onSave(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700">
            {existingProfile ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
            {(preview) && (
              <img
                src={preview}
                alt="Profile Preview"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={existingProfile?.name}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Sex</label>
            <select
              name="sex"
              defaultValue={existingProfile?.sex}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              defaultValue={existingProfile?.age}
              min="1"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              defaultValue={existingProfile?.measurements?.height}
              min="1"
              step="0.1"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Chest (cm)</label>
            <input
              type="number"
              name="chest"
              defaultValue={existingProfile?.measurements?.chest}
              min="1"
              step="0.1"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Waist (cm)</label>
            <input
              type="number"
              name="waist"
              defaultValue={existingProfile?.measurements?.waist}
              min="1"
              step="0.1"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Hips (cm)</label>
            <input
              type="number"
              name="hips"
              defaultValue={existingProfile?.measurements?.hips}
              min="1"
              step="0.1"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}