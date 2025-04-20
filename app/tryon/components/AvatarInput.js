'use client';

import Image from 'next/image';

export default function AvatarInput({
  modelImage,
  setModelImage,
  avatarPrompt,
  setAvatarPrompt,
  avatarSex,
  setAvatarSex,
  seed,
  setSeed,
  avatarInputMode,
  setAvatarInputMode,
  modelInputRef,
  handleImageChange,
  resetModelImage,
}) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Avatar</h3>
      <div className="flex gap-2 mb-4">
        {['file', 'prompt', 'both'].map((mode) => (
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
                avatarInputMode === mode ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  priority
                />
                <button
                  onClick={resetModelImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
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
          className="p-2 border border-gray-200 rounded-lg w-full text-sm bg-white/50 mb-3 focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
          value={avatarPrompt}
          onChange={(e) => setAvatarPrompt(e.target.value)}
          aria-label="Avatar prompt"
        />
      )}
      <div className="flex gap-2">
        <select
          className="p-2 border border-gray-200 rounded-lg flex-1 text-sm bg-white/50 focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
          value={avatarSex}
          onChange={(e) => setAvatarSex(e.target.value)}
          aria-label="Avatar sex"
        >
          <option value="">Auto Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="number"
          placeholder="Seed (optional)"
          className="p-2 border border-gray-200 rounded-lg flex-1 text-sm bg-white/50 focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          aria-label="Seed"
        />
      </div>
      <div className="text-xs text-gray-500 mt-2">
        <b>Tip:</b> Provide an image, prompt, or both. At least one is required.
      </div>
    </div>
  );
}