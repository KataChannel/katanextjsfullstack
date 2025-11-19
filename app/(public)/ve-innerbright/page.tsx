import { 
  HeroSection, 
  MissionVisionSection, 
  PersonalDevelopmentSection,
  CertificationSystemSection,
  WhyInnerBrightSection,
  FiveFoundationsSection
} from "./components";
import { defaultPageData } from "./data";

export default function VeInnerbrightPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Section 1 */}
      <HeroSection slides={defaultPageData.hero.slides} />
      
      {/* Mission, Vision & Core Values Section - Section 2 */}
      <MissionVisionSection data={defaultPageData.missionVision} />
      
      {/* Personal Development Section - Section 3 */}
      <PersonalDevelopmentSection data={defaultPageData.personalDevelopment} />
      
      {/* Certification System Section - Section 4 */}
      <CertificationSystemSection data={defaultPageData.certificationSystem} />
      
      {/* Why InnerBright Section - Section 5 */}
      <WhyInnerBrightSection data={defaultPageData.whyInnerBright} />
      
      {/* Five Foundations Section - Section 6 */}
      <FiveFoundationsSection data={defaultPageData.fiveFoundations} />
    </div>
  );
}
