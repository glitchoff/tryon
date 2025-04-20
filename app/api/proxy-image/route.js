export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
  
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Image URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('Content-Type') || 'image/jpeg';
  
      return new Response(buffer, {
        status: 200,
        headers: { 'Content-Type': contentType },
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }