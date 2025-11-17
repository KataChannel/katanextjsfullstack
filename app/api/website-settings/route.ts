import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

// Helper: Extract domain from hostname
function extractDomain(hostname: string): string {
  // Remove port
  const withoutPort = hostname.split(':')[0];
  
  // Remove www prefix
  const withoutWww = withoutPort.replace(/^www\./, '');
  
  // For localhost, return default domain
  if (withoutWww === 'localhost' || withoutWww === '127.0.0.1') {
    return 'innerbright.vn'; // Default domain for local development
  }
  
  return withoutWww;
}

// GET - Lấy website settings theo domain
export async function GET(request: NextRequest) {
  try {
    // Get domain from query param or detect from request headers
    const searchParams = request.nextUrl.searchParams;
    let domain = searchParams.get('domain');
    
    if (!domain) {
      // Auto-detect domain from request headers (multi-domain support)
      const hostname = request.headers.get('x-hostname') || 
                      request.headers.get('host') || 
                      'localhost:3000';
      
      domain = extractDomain(hostname);
    }

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
