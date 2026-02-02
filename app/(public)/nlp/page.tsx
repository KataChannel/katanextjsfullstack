import HeroSection from "./components/HeroSection";
import QuestionsSection from "./components/QuestionsSection";
import WhatIsNLPSection from "./components/WhatIsNLPSection";
import ValuesSection from "./components/ValuesSection";
import HistorySection from "./components/HistorySection";
import TeachersSection from "./components/TeachersSection";
import CertificationsSection from "./components/CertificationsSection";

export default function BoTheNLPPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <QuestionsSection />
      <WhatIsNLPSection />
      <ValuesSection />
      <HistorySection />
      <TeachersSection />
      <CertificationsSection />
    </div>
  );
}
