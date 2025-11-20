import { NextRequest, NextResponse } from 'next/server';

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
    
    // MinIO endpoint trong Docker network - dùng IP internal
    const minioUrl = `http://172.18.0.4:9000/${path}`;
    
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
