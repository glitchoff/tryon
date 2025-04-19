import axios from 'axios';

const API_KEY = 'a083733c96msh67b99e9ad7be1d2p1a18afjsnd43694f97d97'; // Replace with your RapidAPI key
const API_URL = 'https://try-on-diffusion.p.rapidapi.com/try-on-file';
const API_HOST = 'try-on-diffusion.p.rapidapi.com';
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

function allowedFile(filename) {
  return filename.includes('.') && ALLOWED_EXTENSIONS.includes(filename.split('.').pop()?.toLowerCase() || '');
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const clothingImage = formData.get('clothing_image');
    const avatarImage = formData.get('avatar_image');

    if (!clothingImage || !avatarImage) {
      return new Response(JSON.stringify({ error: 'Missing clothing_image or avatar_image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!allowedFile(clothingImage.name) || !allowedFile(avatarImage.name)) {
      return new Response(JSON.stringify({ error: 'Images must be JPEG or PNG' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const form = new FormData();
    form.append('clothing_image', clothingImage, clothingImage.name);
    form.append('avatar_image', avatarImage, avatarImage.name);

    const response = await axios.post(API_URL, form, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
      timeout: 30000,
    }).catch((error) => {
      if (error.code === 'ECONNABORTED') {
        return { status: 504, data: Buffer.from('API request timed out') };
      }
      throw error;
    });

    if (response.status !== 200) {
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'API rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'API request failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Unexpected response format' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(Buffer.from(response.data), {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: `Server error: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}