import path from 'path';
import { promises as fs } from 'fs';

// When local file is missing (e.g. local dev), proxy from production so images still load
const IMAGE_FALLBACK_ORIGIN = process.env.IMAGE_FALLBACK_ORIGIN || 'https://cardboardpackage.com';

export async function GET(req, { params }) {
  const { filename } = params;

  const filePath = path.join(process.cwd(), 'public/uploads', filename);
  try {
    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(filename).substring(1);
    const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
      },
    });
  } catch (localError) {
    // Local file not found: proxy from production if configured (for local dev)
    try {
      const res = await fetch(`${IMAGE_FALLBACK_ORIGIN}/api/v1/fetchImg/${filename}`);
      if (!res.ok) throw new Error('Proxy failed');
      const blob = await res.blob();
      const contentType = res.headers.get('Content-Type') || 'image/jpeg';
      return new Response(blob, {
        status: 200,
        headers: { 'Content-Type': contentType },
      });
    } catch (proxyError) {
      return new Response(JSON.stringify({ message: 'File not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
