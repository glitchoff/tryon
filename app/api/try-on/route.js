import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing files' });
    }

    const clothingImage = files.clothing_image?.[0];
    const avatarImage = files.avatar_image?.[0];

    if (!clothingImage || !avatarImage) {
      return res.status(400).json({ error: 'Missing images' });
    }

    const API_KEY = "a083733c96msh67b99e9ad7be1d2p1a18afjsnd43694f97d97";
    const API_URL = "https://try-on-diffusion.p.rapidapi.com/try-on-file";
    const API_HOST = "try-on-diffusion.p.rapidapi.com";

    const formData = new FormData();
    formData.append('clothing_image', fs.createReadStream(clothingImage.filepath), clothingImage.originalFilename);
    formData.append('avatar_image', fs.createReadStream(avatarImage.filepath), avatarImage.originalFilename);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: errorText });
      }

      const contentType = response.headers.get('content-type');
      const buffer = Buffer.from(await response.arrayBuffer());
      res.setHeader('Content-Type', contentType);
      res.send(buffer);

    } catch (error) {
      res.status(500).json({ error: 'API request failed: ' + error.message });
    }
  });
}