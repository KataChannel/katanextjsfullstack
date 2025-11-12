import { getPrisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { extractDomain } from "@/lib/database";
import { SeoSettingsForm } from "@/components/seo-settings-form";

export default async function SeoSettingsPage() {
  const headersList = await headers();
  const hostname = headersList.get("x-hostname") || "";
  const domain = extractDomain(hostname);
  
  const prisma = await getPrisma();
  
  // Get or create SEO settings for current domain
  let seoSettings = await prisma.seoSettings.findUnique({
    where: { domain }
  });

  if (!seoSettings) {
    seoSettings = await prisma.seoSettings.create({
      data: {
        domain,
        siteName: "",
        siteDescription: "",
        defaultOgImage: "",
        twitterHandle: "",
        googleAnalytics: "",
        googleTagManager: "",
        facebookPixel: "",
      }
    });
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cài đặt SEO</h1>
        <p className="text-muted-foreground mt-2">
          Cấu hình SEO và tracking cho domain: <strong>{domain}</strong>
        </p>
      </div>

      <SeoSettingsForm domain={domain} seoSettings={seoSettings} />
    </div>
  );
}
