'use client';

import Image from 'next/image';

export default function ClothingInput({
  clothingImage,
  setClothingImage,
  clothingPrompt,
  setClothingPrompt,
  clothingInputMode,
  setClothingInputMode,
  clothingInputRef,
  handleImageChange,
  resetClothingImage,
}) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Clothing</h3>
      <div className="flex gap-2 mb-4">
        {['file', 'prompt', 'both'].map((mode) => (
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
                clothingInputMode === mode ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  priority
                />
                <button
                  onClick={resetClothingImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
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
          className="p-2 border border-gray-200 rounded-lg w-full text-sm bg-white/50 mb-3 focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          value={clothingPrompt}
          onChange={(e) => setClothingPrompt(e.target.value)}
          aria-label="Clothing prompt"
        />
      )}
      <div className="text-xs text-gray-500 mt-2">
        <b>Tip:</b> Provide an image, prompt, or both. At least one is required.<br />
        <b>Best results:</b> JPEG/PNG/WEBP, ≤12MB, min 256x256px, recommended 768x1024px+, clothing on person or ghost mannequin, good lighting, minimal occlusion.
      </div>
    </div>
  );
}