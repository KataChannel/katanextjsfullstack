import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { z } from "zod";

const seoSettingsSchema = z.object({
  domain: z.string(),
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  defaultOgImage: z.string().url().optional().or(z.literal("")),
  twitterHandle: z.string().optional(),
  googleAnalytics: z.string().optional(),
  googleTagManager: z.string().optional(),
  facebookPixel: z.string().optional(),
  homePageType: z.string().optional(), // Can be "page", "post", or empty string
  homePageId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    const validated = seoSettingsSchema.parse(data);
    
    const prisma = await getPrisma();
    
    // Convert empty strings to null for homepage settings
    // If user selects "default homepage", both will be empty string
    const homePageType = validated.homePageType && validated.homePageType !== "" 
      ? validated.homePageType 
      : null;
    const homePageId = validated.homePageId && validated.homePageId !== "" 
      ? validated.homePageId 
      : null;
    
    // Upsert SEO settings
    const seoSettings = await prisma.seoSettings.upsert({
      where: { domain: validated.domain },
      create: {
        domain: validated.domain,
        siteName: validated.siteName || "",
        siteDescription: validated.siteDescription,
        defaultOgImage: validated.defaultOgImage || undefined,
        twitterHandle: validated.twitterHandle,
        googleAnalytics: validated.googleAnalytics,
        googleTagManager: validated.googleTagManager,
        facebookPixel: validated.facebookPixel,
        homePageType,
        homePageId,
      },
      update: {
        siteName: validated.siteName || "",
        siteDescription: validated.siteDescription,
        defaultOgImage: validated.defaultOgImage || undefined,
        twitterHandle: validated.twitterHandle,
        googleAnalytics: validated.googleAnalytics,
        googleTagManager: validated.googleTagManager,
        facebookPixel: validated.facebookPixel,
        homePageType,
        homePageId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: seoSettings,
      message: "Cài đặt SEO đã được lưu thành công",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error saving SEO settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi lưu cài đặt SEO",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { success: false, error: "Domain is required" },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const seoSettings = await prisma.seoSettings.findUnique({
      where: { domain },
    });

    if (!seoSettings) {
      return NextResponse.json(
        { success: false, error: "SEO settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: seoSettings,
    });
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy cài đặt SEO" },
      { status: 500 }
    );
  }
}
