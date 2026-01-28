import HeroSection from "./components/HeroSection";
import QuestionsSection from "./components/QuestionsSection";
import TargetAudienceSection from "./components/TargetAudienceSection";
import WhatIsNLPSection from "./components/WhatIsNLPSection";
import ValuesSection from "./components/ValuesSection";
import WhyChooseNLPSection from "./components/WhyChooseNLPSection";
import ProductShowcaseSection from "./components/ProductShowcaseSection";
import HistorySection from "./components/HistorySection";
import TeachersSection from "./components/TeachersSection";
import CertificationsSection from "./components/CertificationsSection";
import ContactFormSection from "./components/ContactFormSection";

export default function BoTheNLPPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* 3 Câu Hỏi Muôn Thuở */}
      <QuestionsSection />

      {/* Nhân Vật Mục Tiêu */}
      {/* <TargetAudienceSection /> */}

      {/* NLP là gì? */}
      <WhatIsNLPSection />

      {/* Giá trị NLP */}
      <ValuesSection />

      {/* Why Choose NLP Section */}
      {/* <WhyChooseNLPSection /> */}

      {/* Product Showcase Section / Ứng dụng & Bộ thẻ */}
      {/* <ProductShowcaseSection /> */}

      {/* Lược sử NLP */}
      <HistorySection />

      {/* Đội ngũ & Người thầy */}
      {/* <TeachersSection /> */}

      {/* Chứng nhận */}
      {/* <CertificationsSection /> */}

      {/* Contact Form Section */}
      {/* <ContactFormSection /> */}
    </div>
  );
}
