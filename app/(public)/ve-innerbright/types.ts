// Types for Ve InnerBright page components

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  subDescription: string;
  badge: string;
  image: string;
}

export interface MissionVisionData {
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  coreValues: {
    title: string;
    values: string[];
  };
}

export interface PersonalDevelopmentData {
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  image: string;
  imageAlt: string;
}

export interface Certificate {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
}

export interface CertificationSystemData {
  mainTitle: string;
  yearBadge: {
    number: string;
    text: string;
  };
  description: string[];
  certificates: Certificate[];
}

export interface WhyInnerBrightData {
  title: string;
  subtitle: string;
  nlpTitle: string;
  nlpSubtitle: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FoundationItem {
  id: number;
  number: string;
  title: string;
  description: string;
  color: "orange" | "blue";
}

export interface FiveFoundationsData {
  mainTitle: string;
  subtitle: string;
  foundations: FoundationItem[];
}

export interface VeInnerbrightPageData {
  hero: {
    slides: HeroSlide[];
  };
  missionVision: MissionVisionData;
  personalDevelopment: PersonalDevelopmentData;
  certificationSystem: CertificationSystemData;
  whyInnerBright: WhyInnerBrightData;
  fiveFoundations: FiveFoundationsData;
}
