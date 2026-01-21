"use client";

import dynamic from "next/dynamic";
import type { LandingPageSection } from "@/lib/types/landing-page";

// Lazy load section components
const HeroSection = dynamic(() => 
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.HeroSection }))
);
const MissionVisionSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.MissionVisionSection }))
);
const PersonalDevelopmentSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.PersonalDevelopmentSection }))
);
const CertificationSystemSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.CertificationSystemSection }))
);
const WhyInnerBrightSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.WhyInnerBrightSection }))
);
const FiveFoundationsSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.FiveFoundationsSection }))
);
const AtInnerBrightSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.AtInnerBrightSection }))
);
const TrainerSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.TrainerSection }))
);
const CertificationsSection = dynamic(() =>
  import("@/app/(public)/innerbright/components").then(mod => ({ default: mod.CertificationsSection }))
);

interface SectionRendererProps {
  section: LandingPageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.enabled) {
    return null;
  }

  switch (section.type) {
    case "hero":
      return <HeroSection slides={section.data.slides} />;
    
    case "mission-vision":
      return <MissionVisionSection data={section.data} />;
    
    case "personal-development":
      return <PersonalDevelopmentSection data={section.data} />;
    
    case "certification-system":
      return <CertificationSystemSection data={section.data} />;
    
    case "why-innerbright":
      return <WhyInnerBrightSection data={section.data} />;
    
    case "five-foundations":
      return <FiveFoundationsSection data={section.data} />;
    
    case "at-innerbright":
      return <AtInnerBrightSection data={section.data} />;
    
    case "trainer":
      return <TrainerSection data={section.data} />;
    
    case "certifications":
      return <CertificationsSection data={section.data} />;
    
    case "custom":
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: section.data.html }}
          className="custom-section"
        />
      );
    
    default:
      console.warn(`Unknown section type: ${(section as any).type}`);
      return null;
  }
}

interface LandingPageRendererProps {
  sections: LandingPageSection[];
  customCss?: string;
  customJs?: string;
}

export function LandingPageRenderer({ 
  sections, 
  customCss, 
  customJs 
}: LandingPageRendererProps) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      
      <div className="min-h-screen">
        {sortedSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
      
      {customJs && (
        <script dangerouslySetInnerHTML={{ __html: customJs }} />
      )}
    </>
  );
}
