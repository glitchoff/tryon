'use client';

export default function BackgroundInput({ backgroundPrompt, setBackgroundPrompt }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Background</h3>
      <input
        type="text"
        id="backgroundPrompt"
        placeholder="Background prompt (optional)"
        className="p-2 border border-gray-200 rounded-lg w-full text-sm bg-white/50 mb-3 focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
        value={backgroundPrompt}
        onChange={(e) => setBackgroundPrompt(e.target.value)}
        aria-label="Background prompt"
      />
      <div className="text-xs text-gray-500">
        If not provided, the original avatar background is preserved. Example: &quot;in an autumn park&quot;
      </div>
    </div>
  );
}