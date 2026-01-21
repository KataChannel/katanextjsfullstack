import { 
  HeroSection, 
  MissionVisionSection, 
  PersonalDevelopmentSection,
  CertificationSystemSection,
  WhyInnerBrightSection,
  FiveFoundationsSection,
  AtInnerBrightSection,
  TrainerSection,
  CertificationsSection
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
      
      {/* At InnerBright Section - Section 7 */}
      <AtInnerBrightSection data={defaultPageData.atInnerBright} />
      
      {/* Trainer Section - Section 8 */}
      <TrainerSection data={defaultPageData.trainer} />
      
      {/* Certifications Section - Section 9 */}
      <CertificationsSection data={defaultPageData.certifications} />
    </div>
  );
}
