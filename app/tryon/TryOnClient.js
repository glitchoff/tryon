'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import AvatarInput from './components/AvatarInput';
import ClothingInput from './components/ClothingInput';
import BackgroundInput from './components/BackgroundInput';
import ResultSection from './components/ResultSection';

export default function TryOnClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TryOnContent />
    </Suspense>
  );
}

function TryOnContent() {
  // State
  const [modelImage, setModelImage] = useState({ src: '', file: null });

  // On mount, auto-insert avatar image from localStorage if available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (modelImage.src) return; // don't overwrite if already set
    try {
      const profileStr = localStorage.getItem('profile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        if (profile.image && profile.image.startsWith('data:image/')) {
          setModelImage({ src: profile.image, file: null });
        }
      }
    } catch (err) {
      // ignore errors
    }
  }, [modelImage.src]);
  const [clothingImage, setClothingImage] = useState({ src: '', file: null });
  const [outputImage, setOutputImage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clothingPrompt, setClothingPrompt] = useState('');
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [avatarSex, setAvatarSex] = useState('');
  const [seed, setSeed] = useState('');
  const [avatarInputMode, setAvatarInputMode] = useState('both');
  const [clothingInputMode, setClothingInputMode] = useState('both');
  const [etaProgress, setEtaProgress] = useState('');

  // Refs
  const modelInputRef = useRef(null);
  const clothingInputRef = useRef(null);
  const resultRef = useRef(null);

  // Search params
  const searchParams = useSearchParams();
  const queryImageUrl = searchParams.get('q');

  // Handle query parameter image
  useEffect(() => {
    if (!queryImageUrl) return;

    const fetchImage = async () => {
      try {
        if (queryImageUrl.startsWith('data:image/')) {
          setClothingImage({ src: queryImageUrl, file: null });
          return;
        }

        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(queryImageUrl)}`);
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        const file = new File([blob], 'clothing-image.jpg', { type: blob.type });
        setClothingImage({ src: URL.createObjectURL(blob), file });
      } catch (err) {
        setError('Failed to load image from URL');
      }
    };
    fetchImage();
  }, [queryImageUrl]);

  // Handle image change
  const handleImageChange = useCallback((e, setImage) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('Image size must be ≤12MB.');
      return;
    }

    setImage({ src: URL.createObjectURL(file), file });
    setError('');
  }, []);

  // Handle try-on API call
  const handleTryOn = useCallback(async () => {
    setError('');
    setOutputImage('');
    setIsLoading(true);

    if (!clothingImage.file && !clothingPrompt.trim()) {
      setError('Please provide a clothing image or prompt.');
      setIsLoading(false);
      return;
    }
    if (!modelImage.file && !avatarPrompt.trim()) {
      setError('Please provide an avatar image or prompt.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    if (clothingImage.file) formData.append('clothing_image', clothingImage.file);
    if (modelImage.file) formData.append('avatar_image', modelImage.file);
    if (clothingPrompt.trim()) formData.append('clothing_prompt', clothingPrompt.trim());
    if (avatarPrompt.trim()) formData.append('avatar_prompt', avatarPrompt.trim());
    if (backgroundPrompt.trim()) formData.append('background_prompt', backgroundPrompt.trim());
    if (avatarSex.trim()) formData.append('avatar_sex', avatarSex.trim());
    if (seed.trim()) formData.append('seed', seed.trim());

    try {
      const response = await fetch('https://try-on-diffusion.p.rapidapi.com/try-on-file', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'x-rapidapi-host': 'try-on-diffusion.p.rapidapi.com',
        },
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'API request failed' };
        }
        setError(errorData.error || JSON.stringify(errorData) || 'API request failed');
        setIsLoading(false);
        return;
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.startsWith('image/')) {
        const blob = await response.blob();
        setOutputImage(URL.createObjectURL(blob));
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [
    clothingImage,
    modelImage,
    clothingPrompt,
    avatarPrompt,
    backgroundPrompt,
    avatarSex,
    seed,
  ]);

  // Reset functions
  const resetModelImage = useCallback(() => {
    setModelImage({ src: '', file: null });
    if (modelInputRef.current) modelInputRef.current.value = '';
    setOutputImage('');
    setError('');
  }, []);

  const resetClothingImage = useCallback(() => {
    setClothingImage({ src: '', file: null });
    if (clothingInputRef.current) clothingInputRef.current.value = '';
    setOutputImage('');
    setError('');
  }, []);

  // Scroll to result
  useEffect(() => {
    if (outputImage && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputImage]);

  // ETA progress
  useEffect(() => {
    if (!isLoading) {
      setEtaProgress('');
      return;
    }

    const etaSequence = ['1/15 seconds', '15/20 seconds', '18/25 seconds', '20/30 seconds'];
    let index = 0;
    const interval = setInterval(() => {
      setEtaProgress(etaSequence[index]);
      index = (index + 1) % etaSequence.length;
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full md:w-3/4 flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-gray-900">Virtual Try-On</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-4 text-red-600 font-bold text-lg"
                aria-label="Close error message"
              >
(UINT8Array[0xC3][0x97])              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AvatarInput
              modelImage={modelImage}
              setModelImage={setModelImage}
              avatarPrompt={avatarPrompt}
              setAvatarPrompt={setAvatarPrompt}
              avatarSex={avatarSex}
              setAvatarSex={setAvatarSex}
              seed={seed}
              setSeed={setSeed}
              avatarInputMode={avatarInputMode}
              setAvatarInputMode={setAvatarInputMode}
              modelInputRef={modelInputRef}
              handleImageChange={handleImageChange}
              resetModelImage={resetModelImage}
            />
            <ClothingInput
              clothingImage={clothingImage}
              setClothingImage={setClothingImage}
              clothingPrompt={clothingPrompt}
              setClothingPrompt={setClothingPrompt}
              clothingInputMode={clothingInputMode}
              setClothingInputMode={setClothingInputMode}
              clothingInputRef={clothingInputRef}
              handleImageChange={handleImageChange}
              resetClothingImage={resetClothingImage}
            />
          </div>
          <BackgroundInput
            backgroundPrompt={backgroundPrompt}
            setBackgroundPrompt={setBackgroundPrompt}
          />
          <button
            onClick={handleTryOn}
            disabled={
              !(modelImage.file || avatarPrompt.trim()) ||
              !(clothingImage.file || clothingPrompt.trim()) ||
              isLoading
            }
            className={`w-full py-3 rounded-lg text-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
              !(modelImage.file || avatarPrompt.trim()) ||
              !(clothingImage.file || clothingPrompt.trim()) ||
              isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600'
            }`}
          >
            {isLoading ? `Processing... ${etaProgress}` : 'Try On'}
          </button>
          <ResultSection outputImage={outputImage} resultRef={resultRef} />
        </div>
        {/* Instructions Sidebar */}
        <div className="w-full md:w-1/4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md md:sticky md:top-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
          <ul className="text-sm text-gray-600 space-y-3">
            <li>
              <b>Avatar:</b> Upload an image or describe the person (e.g., &quot;young woman with long hair&quot;).
            </li>
            <li>
              <b>Clothing:</b> Upload a clothing image (≤12MB, min 256x256px) or describe it (e.g., &quot;red dress&quot;).
            </li>
            <li>
              <b>Background:</b> Optionally describe the background (e.g., &quot;in an autumn park&quot;).
            </li>
            <li>
              <b>Options:</b> Set avatar sex and seed for consistent results.
            </li>
            <li>
              <b>Best Results:</b> Use clear, well-lit clothing images with minimal occlusion.
            </li>
            <li>
              <b>Try On:</b> Click &quot;Try On&quot; to generate the image. Download or share the result.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}