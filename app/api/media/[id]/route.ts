import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

// GET /api/media/[id] - Get single media
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = await getPrisma();
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy media' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải media' },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = await getPrisma();

    // Get media info
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy media' },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const filepath = join(process.cwd(), 'public', media.url);
      await unlink(filepath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Media đã được xóa',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể xóa media' },
      { status: 500 }
    );
  }
}
