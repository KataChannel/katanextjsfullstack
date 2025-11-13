import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

// GET - Lấy website settings theo domain
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain') || 'tazagroup.vn';

    const prisma = await getPrisma(domain);
    
    const settings = await prisma.websiteSettings.findUnique({
      where: { domain },
    });

    if (!settings) {
      return NextResponse.json(
        { error: 'Website settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching website settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website settings' },
      { status: 500 }
    );
  }
}

// POST - Cập nhật website settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      domain = 'tazagroup.vn',
      logo,
      logoAlt,
      headerHtml,
      navigationMenu,
      footerHtml,
      footerText,
      socialLinks,
    } = body;

    const prisma = await getPrisma(domain);

    const settings = await prisma.websiteSettings.upsert({
      where: { domain },
      update: {
        logo,
        logoAlt,
        headerHtml,
        navigationMenu,
        footerHtml,
        footerText,
        socialLinks,
      },
      create: {
        domain,
        logo,
        logoAlt,
        headerHtml,
        navigationMenu,
        footerHtml,
        footerText,
        socialLinks,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating website settings:', error);
    return NextResponse.json(
      { error: 'Failed to update website settings' },
      { status: 500 }
    );
  }
}
