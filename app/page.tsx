
'use client';

export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Try-On</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 class="text-2xl font-bold mb-6 text-center">Virtual Try-On</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Model Image Upload -->
            <div class="flex flex-col items-center">
                <label class="text-lg font-semibold mb-2">Model Image</label>
                <div class="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img id="model-preview" class="max-w-full max-h-full hidden" alt="Model Preview">
                    <span id="model-placeholder" class="text-gray-500">Upload Image</span>
                </div>
                <input type="file" id="model-image" accept="image/jpeg,image/png" class="mt-2">
            </div>
            <!-- Clothing Image Upload -->
            <div class="flex flex-col items-center">
                <label class="text-lg font-semibold mb-2">Clothing Image</label>
                <div class="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img id="clothing-preview" class="max-w-full max-h-full hidden" alt="Clothing Preview">
                    <span id="clothing-placeholder" class="text-gray-500">Upload Image</span>
                </div>
                <input type="file" id="clothing-image" accept="image/jpeg,image/png" class="mt-2">
            </div>
            <!-- Output Image Preview -->
            <div class="flex flex-col items-center">
                <label class="text-lg font-semibold mb-2">Result</label>
                <div class="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img id="output-preview" class="max-w-full max-h-full hidden" alt="Output Preview">
                    <span id="output-placeholder" class="text-gray-500">Result Image</span>
                </div>
            </div>
        </div>
        <div class="mt-6 text-center">
            <button id="try-on-button" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400" disabled>Try On</button>
            <p id="status" class="mt-2 text-red-500 hidden"></p>
        </div>
    </div>

    <script>
        const modelInput = document.getElementById('model-image');
        const clothingInput = document.getElementById('clothing-image');
        const modelPreview = document.getElementById('model-preview');
        const clothingPreview = document.getElementById('clothing-preview');
        const outputPreview = document.getElementById('output-preview');
        const modelPlaceholder = document.getElementById('model-placeholder');
        const clothingPlaceholder = document.getElementById('clothing-placeholder');
        const outputPlaceholder = document.getElementById('output-placeholder');
        const tryOnButton = document.getElementById('try-on-button');
        const status = document.getElementById('status');

        // Enable/disable button based on file uploads
        function updateButtonState() {
            tryOnButton.disabled = !(modelInput.files.length && clothingInput.files.length);
        }

        // Preview uploaded images
        modelInput.addEventListener('change', () => {
            const file = modelInput.files[0];
            if (file) {
                modelPreview.src = URL.createObjectURL(file);
                modelPreview.classList.remove('hidden');
                modelPlaceholder.classList.add('hidden');
            }
            updateButtonState();
        });

        clothingInput.addEventListener('change', () => {
            const file = clothingInput.files[0];
            if (file) {
                clothingPreview.src = URL.createObjectURL(file);
                clothingPreview.classList.remove('hidden');
                clothingPlaceholder.classList.add('hidden');
            }
            updateButtonState();
        });

        // Handle Try-On button click
        tryOnButton.addEventListener('click', async () => {
            status.classList.add('hidden');
            tryOnButton.disabled = true;
            outputPreview.classList.add('hidden');
            outputPlaceholder.classList.remove('hidden');

            const formData = new FormData();
            formData.append('clothing_image', clothingInput.files[0]);
            formData.append('avatar_image', modelInput.files[0]);

            try {
                const response = await fetch('/try-on', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'API request failed');
                }

                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.startsWith('image/')) {
                    const blob = await response.blob();
                    outputPreview.src = URL.createObjectURL(blob);
                    outputPreview.classList.remove('hidden');
                    outputPlaceholder.classList.add('hidden');
                } else {
                    const text = await response.json();
                    throw new Error(text.error || 'Unexpected response format');
                }
            } catch (error) {
                status.textContent = `Error: ${error.message}`;
                status.classList.remove('hidden');
            } finally {
                tryOnButton.disabled = false;
            }
        });
    </script>
</body>
</html>`.replace(/`/g, '\`') }} />
  );
}
