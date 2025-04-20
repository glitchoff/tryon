'use client';

import Image from 'next/image';

export default function ResultSection({ outputImage, resultRef }) {
  return (
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
            priority
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
                await navigator.share({
                  files: [file],
                  title: 'Virtual Try-On Result',
                  text: 'Check out my virtual try-on!',
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
  );
}