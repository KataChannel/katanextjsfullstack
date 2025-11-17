import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import { getDomainConfig } from '@/lib/domain-config';
import { getMinioClient, uploadToMinio, MINIO_CONFIGS } from '@/lib/minio';

const mediaSchema = z.object({
  filename: z.string(),
  url: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  mimeType: z.string(),
  size: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// GET /api/media - List all media
export async function GET(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.media.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách media' },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload media
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không có file được tải lên' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng file không được hỗ trợ' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File quá lớn (tối đa 10MB)' },
        { status: 400 }
      );
    }

    // Get domain config để xác định storage type
    const hostname = request.headers.get('host') || 'localhost:3005';
    const domainConfig = getDomainConfig(hostname);
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;
    
    // Upload dựa vào storage type
    if (domainConfig.storage?.type === 'minio') {
      // Upload lên MinIO
      const minioConfig = MINIO_CONFIGS[domainConfig.domain];
      
      if (!minioConfig) {
        return NextResponse.json(
          { success: false, error: 'MinIO config không tồn tại cho domain này' },
          { status: 500 }
        );
      }

      const minioClient = getMinioClient(domainConfig.domain);
      
      url = await uploadToMinio(
        minioClient,
        minioConfig.bucketName,
        filename,
        buffer,
        file.type,
        {
          'alt': formData.get('alt') as string || '',
          'caption': formData.get('caption') as string || '',
          'original-filename': file.name,
        }
      );
      
      console.log(`✅ Uploaded to MinIO: ${url}`);
    } else {
      // Upload local filesystem (default)
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      url = `/uploads/${filename}`;
      
      console.log(`✅ Uploaded to local: ${url}`);
    }
    
    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;
    
    if (file.type.startsWith('image/')) {
      // For production, use sharp or similar library
      // For now, we'll store without dimensions
    }

    // Save to database
    const prisma = await getPrisma();
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        alt: formData.get('alt') as string || undefined,
        caption: formData.get('caption') as string || undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: media,
        message: `File đã được tải lên thành công (${domainConfig.storage?.type || 'local'})`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải file lên' },
      { status: 500 }
    );
  }
}
