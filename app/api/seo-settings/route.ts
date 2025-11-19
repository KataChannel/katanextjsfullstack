import { NextRequest, NextResponse } from "next/server";

// SEO Settings API has been deprecated and merged into Website Settings
// Please use /api/website-settings instead

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: "This API endpoint has been deprecated. Please use /api/website-settings instead.",
      redirect: "/api/website-settings",
    },
    { status: 410 } // 410 Gone
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: "This API endpoint has been deprecated. Please use /api/website-settings instead.",
      redirect: "/api/website-settings",
    },
    { status: 410 } // 410 Gone
  );
}
