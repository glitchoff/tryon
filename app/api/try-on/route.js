import { NextResponse } from 'next/server';
import formidable from 'formidable';
import axios from 'axios';
import { readFileSync } from 'fs';

const API_KEY = process.env.RAPIDAPI_KEY; // Store in Vercel environment variables
const API_URL = 'https://try-on-diffusion.p.rapidapi.com/try-on-file';
const API_HOST = 'try-on-diffusion.p.rapidapi.com';
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

function allowedFile(filename) {
  return filename.includes('.') && ALLOWED_EXTENSIONS.includes(filename.split('.').pop()?.toLowerCase() || '');
}

export async function POST(req) {
  try {
    // Parse multipart/form-data using formidable
    const form = formidable({ multiples: true, maxFileSize: 4 * 1024 * 1024 }); // 4MB limit
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const clothingImage = files.clothing_image?.[0];
    const avatarImage = files.avatar_image?.[0];

    if (!clothingImage || !avatarImage) {
      return NextResponse.json({ error: 'Missing clothing_image or avatar_image' }, { status: 400 });
    }

    if (!allowedFile(clothingImage.originalFilename) || !allowedFile(avatarImage.originalFilename)) {
      return NextResponse.json({ error: 'Images must be JPEG or PNG' }, { status: 400 });
    }

    // Create FormData for RapidAPI request
    const formData = new FormData();
    formData.append('clothing_image', new Blob([readFileSync(clothingImage.filepath)]), clothingImage.originalFilename);
    formData.append('avatar_image', new Blob([readFileSync(avatarImage.filepath)]), avatarImage.originalFilename);

    // Make request to RapidAPI
    const response = await axios.post(API_URL, formData, {
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
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      if (response.status === 429) {
        return NextResponse.json({ error: 'API rate limit exceeded' }, { status: 429 });
      }
      return NextResponse.json({ error: 'API request failed' }, { status: response.status });
    }

    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 });
    }

    return new NextResponse(Buffer.from(response.data), {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}