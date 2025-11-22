// Landing Page Section Types

export type SectionType = 
  | "hero"
  | "mission-vision"
  | "personal-development"
  | "certification-system"
  | "why-innerbright"
  | "five-foundations"
  | "at-innerbright"
  | "trainer"
  | "certifications"
  | "custom";

export interface LandingPageSection {
  id: string;
  type: SectionType;
  order: number;
  enabled: boolean;
  data: any; // Generic data object, can be typed more specifically per section
}

export interface LandingPageConfig {
  sections: LandingPageSection[];
  customCss?: string;
  customJs?: string;
}
