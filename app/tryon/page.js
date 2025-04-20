'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function TryOn() {
  const [modelImage, setModelImage] = useState({ src: '', file: null });
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
  const modelInputRef = useRef(null);
  const clothingInputRef = useRef(null);
  const resultRef = useRef(null);

  const searchParams = useSearchParams();
  const queryImageUrl = searchParams.get('q');

  // Handle query parameter image
  useEffect(() => {
    if (queryImageUrl) {
      const fetchImage = async () => {
        try {
          // Handle data URLs
          if (queryImageUrl.startsWith('data:image/')) {
            setClothingImage({ src: queryImageUrl, file: null });
            return;
          }

          // Fetch external image via proxy API
          const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(queryImageUrl)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }
          const blob = await response.blob();
          const file = new File([blob], 'clothing-image.jpg', { type: blob.type });
          setClothingImage({ src: URL.createObjectURL(blob), file });
        } catch (err) {
          setError('Failed to load image from URL');
          console.error('Error fetching image:', err);
        }
      };
      fetchImage();
    }
  }, [queryImageUrl]);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name, 'size:', file.size);
      setImage({ src: URL.createObjectURL(file), file });
      setError('');
    }
  };

  const handleTryOn = async () => {
    setError('');
    setOutputImage('');
    setIsLoading(true);

    const formData = new FormData();
    if (clothingImage.file) {
      formData.append('clothing_image', clothingImage.file);
    }
    if (modelImage.file) {
      formData.append('avatar_image', modelImage.file);
    }
    if (clothingPrompt.trim()) formData.append('clothing_prompt', clothingPrompt.trim());
    if (avatarPrompt.trim()) formData.append('avatar_prompt', avatarPrompt.trim());
    if (backgroundPrompt.trim()) formData.append('background_prompt', backgroundPrompt.trim());
    if (avatarSex.trim()) formData.append('avatar_sex', avatarSex.trim());
    if (seed.trim()) formData.append('seed', seed.trim());

    console.log('Sending parameters:', {
      clothing_image: clothingImage.file,
      avatar_image: modelImage.file,
      clothing_prompt: clothingPrompt,
      avatar_prompt: avatarPrompt,
      background_prompt: backgroundPrompt,
      avatar_sex: avatarSex,
      seed: seed
    });

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

    try {
      const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
      const RAPIDAPI_HOST = "try-on-diffusion.p.rapidapi.com";
      const RAPIDAPI_URL = "https://try-on-diffusion.p.rapidapi.com/try-on-file";

      console.log('Sending fetch to RapidAPI...');
      const response = await fetch(RAPIDAPI_URL, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST
        },
        body: formData,
      });
      console.log('Fetch response received:', response.status, response.statusText);

      if (!response.ok) {
        let errorMsg = 'API request failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          console.error('RapidAPI error response:', errorData);
        } catch (errParse) {
          console.error('Error parsing error response:', errParse);
        }
        throw new Error(errorMsg);
      }

      const contentType = response.headers.get('Content-Type');
      console.log('Response Content-Type:', contentType);
      if (contentType && contentType.startsWith('image/')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setOutputImage(imageUrl);
        console.log('Output image set:', imageUrl);
      } else {
        const responseText = await response.text();
        setError(responseText);
        console.error('Non-image API response:', responseText);
        return;
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in handleTryOn:', err);
    } finally {
      setIsLoading(false);
      console.log('Try-on process finished.');
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

  // Scroll to result when outputImage is set
  useEffect(() => {
    if (outputImage && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputImage]);

  // Dummy ETA progress during loading
  useEffect(() => {
    if (!isLoading) {
      setEtaProgress('');
      return;
    }

    const etaSequence = [
      '1/15 seconds',
      '15/20 seconds',
      '18/25 seconds',
      '20/30 seconds'
    ];
    let index = 0;

    const interval = setInterval(() => {
      setEtaProgress(etaSequence[index]);
      index = (index + 1) % etaSequence.length;
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-100 to-gray-200">
        <Head>
          <title>Virtual Try-On</title>
          <meta name="description" content="Try on clothes virtually" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div className="w-full max-w-7xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full md:w-3/4 flex flex-col gap-8">
            {/* Input Section */}
            <div className="w-full flex flex-col gap-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Virtual Try-On</h1>
              {/* Error Message */}
              {error && (
                <div
                  className="flex items-center justify-between bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm"
                  role="alert"
                >
                  <span className="block text-sm break-all">{error}</span>
                  <button
                    onClick={() => setError('')}
                    className="ml-4 text-red-600 font-bold text-lg focus:outline-none"
                    aria-label="Close error message"
                  >
                    ×
                  </button>
                </div>
              )}
              {/* Avatar and Clothing Inputs Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Input */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Avatar</h3>
                  <div className="flex gap-2 mb-4">
                    {['file', 'prompt', 'both'].map(mode => (
                      <label key={mode} className="flex-1">
                        <input
                          type="radio"
                          name="avatarInputMode"
                          value={mode}
                          checked={avatarInputMode === mode}
                          onChange={() => setAvatarInputMode(mode)}
                          className="hidden"
                        />
                        <span
                          className={`block text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${
                            avatarInputMode === mode
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {(avatarInputMode === 'file' || avatarInputMode === 'both') && (
                    <div className="mb-4">
                      <div className="w-32 h-32 border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-white/80 relative mx-auto">
                        {modelImage.src ? (
                          <>
                            <Image
                              src={modelImage.src}
                              alt="Model Preview"
                              className="max-w-full max-h-full object-contain"
                              width={128}
                              height={128}
                            />
                            <button
                              onClick={resetModelImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
                              title="Remove image"
                              aria-label="Remove avatar image"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 font-medium">Upload Image</span>
                        )}
                      </div>
                      <input
                        id="avatarImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleImageChange(e, setModelImage)}
                        className="mt-2 text-sm text-gray-600 w-full"
                        ref={modelInputRef}
                        aria-label="Avatar image upload"
                      />
                    </div>
                  )}
                  {(avatarInputMode === 'prompt' || avatarInputMode === 'both') && (
                    <input
                      type="text"
                      id="avatarPrompt"
                      placeholder="Avatar prompt (optional)"
                      className="p-2 border border-gray-200 rounded-lg w-full text-sm bg-white/50 mb-3 focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all duration-200"
                      value={avatarPrompt}
                      onChange={e => setAvatarPrompt(e.target.value)}
                      aria-label="Avatar prompt"
                    />
                  )}
                  <div className="flex gap-2">
                    <select
                      className="p-2 border border-gray-200 rounded-lg flex-1 text-sm bg-white/50 focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all duration-200"
                      value={avatarSex}
                      onChange={e => setAvatarSex(e.target.value)}
                      aria-label="Avatar sex"
                    >
                      <option value="">Auto Sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Seed (optional)"
                      className="p-2 border border-gray-200 rounded-lg flex-1 text-sm bg-white/50 focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all duration-200"
                      value={seed}
                      onChange={e => setSeed(e.target.value)}
                      aria-label="Seed"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <b>Tip:</b> Provide an image, prompt, or both. At least one is required.
                  </div>
                </div>
                {/* Clothing Input */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Clothing</h3>
                  <div className="flex gap-2 mb-4">
                    {['file', 'prompt', 'both'].map(mode => (
                      <label key={mode} className="flex-1">
                        <input
                          type="radio"
                          name="clothingInputMode"
                          value={mode}
                          checked={clothingInputMode === mode}
                          onChange={() => setClothingInputMode(mode)}
                          className="hidden"
                        />
                        <span
                          className={`block text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${
                            clothingInputMode === mode
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {(clothingInputMode === 'file' || clothingInputMode === 'both') && (
                    <div className="mb-4">
                      <div className="w-32 h-32 border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-white/80 relative mx-auto">
                        {clothingImage.src ? (
                          <>
                            <Image
                              src={clothingImage.src}
                              alt="Clothing Preview"
                              className="max-w-full max-h-full object-contain"
                              width={128}
                              height={128}
                            />
                            <button
                              onClick={resetClothingImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
                              title="Remove image"
                              aria-label="Remove clothing image"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 font-medium">Upload Clothing Image</span>
                        )}
                      </div>
                      <input
                        id="clothingImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleImageChange(e, setClothingImage)}
                        className="mt-2 text-sm text-gray-600 w-full"
                        ref={clothingInputRef}
                        aria-label="Clothing image upload"
                      />
                    </div>
                  )}
                  {(clothingInputMode === 'prompt' || clothingInputMode === 'both') && (
                    <input
                      type="text"
                      id="clothingPrompt"
                      placeholder="Clothing prompt (optional)"
                      className="p-2 border border-gray-200 rounded-lg w-full text-sm bg-white/50 mb-3 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all duration-200"
                      value={clothingPrompt}
                      onChange={e => setClothingPrompt(e.target.value)}
                      aria-label="Clothing prompt"
                    />
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    <b>Tip:</b> Provide an image, prompt, or both. At least one is required.<br />
                    <b>Best results:</b> JPEG/PNG/WEBP, ≤12MB, min 256x256px, recommended 768x1024px+, clothing on person or ghost mannequin, good lighting, minimal occlusion.
                  </div>
                </div>
              </div>
              {/* Background Input */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Background</h3>
                <input
                  type="text"
                  id="backgroundPrompt"
                  placeholder="Background prompt (optional)"
                  className="p-2 border border-gray-200 rounded-lg w-full text-sm bg-white/50 mb-3 focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all duration-200"
                  value={backgroundPrompt}
                  onChange={e => setBackgroundPrompt(e.target.value)}
                  aria-label="Background prompt"
                />
                <div className="text-xs text-gray-500">
                  If not provided, the original avatar background is preserved. Example: &quot;in an autumn park&quot;
                </div>
              </div>
              {/* Try On Button */}
              <button
                onClick={handleTryOn}
                disabled={
                  !(modelImage.file || avatarPrompt.trim()) ||
                  !(clothingImage.file || clothingPrompt.trim()) ||
                  isLoading
                }
                className={`w-full py-3 rounded-lg text-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
                  ${
                    !(modelImage.file || avatarPrompt.trim()) ||
                    !(clothingImage.file || clothingPrompt.trim()) ||
                    isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600'
                  }`}
              >
                {isLoading ? `Processing... ${etaProgress ? `(${etaProgress})` : ''}` : 'Try On'}
              </button>
            </div>
            {/* Result Section */}
            <div ref={resultRef} className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Result</h2>
              <div className="w-full max-w-md h-96 border-2 border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center">
                {outputImage ? (
                  <Image
                    src={outputImage}
                    alt="Output Preview"
                    className="max-w-full max-h-full object-contain"
                    width={384}
                    height={512}
                  />
                ) : (
                  <span className="text-gray-400 font-medium">Result Image</span>
                )}
              </div>
              {outputImage && (
                <div className="flex gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm font-medium shadow-sm transition-colors duration-200"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = outputImage;
                      a.download = 'virtual-tryon-result.png';
                      a.click();
                    }}
                  >
                    Download
                  </button>
                  <button
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-sm transition-colors duration-200"
                    onClick={async () => {
                      if (navigator.share) {
                        const response = await fetch(outputImage);
                        const blob = await response.blob();
                        const file = new File([blob], 'virtual-tryon-result.png', { type: blob.type });
                        navigator.share({
                          files: [file],
                          title: 'Virtual Try-On Result',
                          text: 'Check out my virtual try-on!'
                        });
                      } else {
                        alert('Sharing is not supported on this browser.');
                      }
                    }}
                  >
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Instructions Sidebar */}
          <div className="w-full md:w-1/4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md md:sticky md:top-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li>
                <b>Avatar:</b> Upload an image or enter a prompt describing the person (e.g., &quot;young woman with long hair&quot;). Select "File," "Prompt," or "Both" using the switcher.
              </li>
              <li>
                <b>Clothing:</b> Upload a clothing image (JPEG/PNG/WEBP, ≤12MB, min 256x256px, recommended 768x1024px+) or describe the clothing (e.g., &quot;red dress&quot;). Use the switcher to choose input mode.
              </li>
              <li>
                <b>Background:</b> Optionally describe the background (e.g., &quot;in an autumn park&quot;). If left blank, the original avatar background is preserved.
              </li>
              <li>
                <b>Options:</b> Set avatar sex (Auto, Male, Female) and seed (optional) for consistent results.
              </li>
              <li>
                <b>Best Results:</b> Use clear, well-lit clothing images on a person or ghost mannequin with minimal occlusion. Prompts should be specific and descriptive.
              </li>
              <li>
                <b>Try On:</b> Click the &quot;Try On&quot; button to generate the virtual try-on image. The result will appear below, and you can download or share it.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}