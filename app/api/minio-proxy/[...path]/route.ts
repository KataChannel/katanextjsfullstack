import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering để đọc env vars runtime
export const dynamic = 'force-dynamic';

/**
 * API Route để proxy MinIO images
 * Giải quyết Mixed Content error bằng cách serve images qua HTTPS
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    const path = params.path.join('/');
    
    // MinIO endpoint - support Docker network
    // Use MINIO_ENDPOINT (hostname) + MINIO_PORT from docker-compose
    // Fallback to internal IP if not set
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'minio';
    const minioPort = process.env.MINIO_PORT || '9000';
    const minioHost = `${minioEndpoint}:${minioPort}`;
    const minioUrl = `http://${minioHost}/${path}`;
    
    console.log('[MinIO Proxy] Fetching:', minioUrl);
    
    // Fetch từ MinIO - không cần Host header
    const response = await fetch(minioUrl);
    
    if (!response.ok) {
      console.error('[MinIO Proxy] Error:', response.status, response.statusText);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Get image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/webp';
    
    // Return với headers cache
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[MinIO Proxy] Exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
