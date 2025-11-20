import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import ProductShowcaseSection from "./components/ProductShowcaseSection";
import WhyChooseNLPSection from "./components/WhyChooseNLPSection";
import ContactFormSection from "./components/ContactFormSection";

export default function BoTheNLPPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Section 1 */}
      <HeroSection />
      
      {/* Benefits Section - Section 2 */}
      <BenefitsSection />
      
      {/* Product Showcase Section - Section 3 */}
      <ProductShowcaseSection />
      
      {/* Why Choose NLP Section - Section 4 */}
      <WhyChooseNLPSection />
      
      {/* Contact Form Section - Section 5 */}
      <ContactFormSection />
    </div>
  );
}
