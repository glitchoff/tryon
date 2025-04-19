'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [modelImage, setModelImage] = useState({ src: '', file: null });
  const [clothingImage, setClothingImage] = useState({ src: '', file: null });
  const [outputImage, setOutputImage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modelInputRef = useRef(null);
  const clothingInputRef = useRef(null);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File size exceeds 4MB limit');
        return;
      }
      setImage({ src: URL.createObjectURL(file), file });
      setError('');
    }
  };

  const handleTryOn = async () => {
    setError('');
    setOutputImage('');
    setIsLoading(true);

    const formData = new FormData();
    if (clothingImage.file && modelImage.file) {
      formData.append('clothing_image', clothingImage.file);
      formData.append('avatar_image', modelImage.file);
    } else {
      setError('Please upload both model and clothing images');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/try-on', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.startsWith('image/')) {
        const blob = await response.blob();
        setOutputImage(URL.createObjectURL(blob));
      } else {
        const text = await response.json();
        throw new Error(text.error || 'Unexpected response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModelImage = () => {
    setModelImage({ src: '', file: null });
    if (modelInputRef.current) modelInputRef.current.value = '';
    setOutputImage('');
    setError('');
  };

  const resetClothingImage = () => {
    setClothingImage({ src: '', file: null });
    if (clothingInputRef.current) clothingInputRef.current.value = '';
    setOutputImage('');
    setError('');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Head>
        <title>Virtual Try-On</title>
        <meta name="description" content="Try on clothes virtually" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Virtual Try-On</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Model Image Upload */}
          <div className="flex flex-col items-center">
            <label className="text-lg font-semibold mb-2 text-gray-700">Model Image</label>
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 relative">
              {modelImage.src ? (
                <>
                  <img src={modelImage.src} alt="Model Preview" className="max-w-full max-h-full object-contain" />
                  <button
                    onClick={resetModelImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleImageChange(e, setModelImage)}
              className="mt-2 text-sm text-gray-600"
              ref={modelInputRef}
            />
          </div>
          {/* Clothing Image Upload */}
          <div className="flex flex-col items-center">
            <label className="text-lg font-semibold mb-2 text-gray-700">Clothing Image</label>
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 relative">
              {clothingImage.src ? (
                <>
                  <img src={clothingImage.src} alt="Clothing Preview" className="max-w-full max-h-full object-contain" />
                  <button
                    onClick={resetClothingImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="text-gray-500">Upload Superman Image</span>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleImageChange(e, setClothingImage)}
              className="mt-2 text-sm text-gray-600"
              ref={clothingInputRef}
            />
          </div>
          {/* Output Image Preview */}
          <div className="flex flex-col items-center">
            <label className="text-lg font-semibold mb-2 text-gray-700">Result</label>
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              {outputImage ? (
                <img src={outputImage} alt="Output Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-gray-500">Result Image</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleTryOn}
            disabled={!modelImage.file || !clothingImage.file || isLoading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
              !modelImage.file || !clothingImage.file || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Processing...' : 'Try On'}
          </button>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}