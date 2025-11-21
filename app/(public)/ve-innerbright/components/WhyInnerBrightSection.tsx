"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface WhyInnerBrightData {
  title: string;
  subtitle: string;
  nlpTitle: string;
  nlpSubtitle: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface WhyInnerBrightSectionProps {
  data?: WhyInnerBrightData;
}

export default function WhyInnerBrightSection({ data }: WhyInnerBrightSectionProps) {
  const defaultData: WhyInnerBrightData = {
    title: "Vì sao InnerBright",
    subtitle: "là lựa chọn khác biệt?",
    nlpTitle: "NLP",
    nlpSubtitle: "(Neuro Linguistic Programming)",
    description: "Lập trình ngôn ngữ tư duy, không chỉ là một tập hợp các kỹ thuật, mà là một hành trình khám phá sức mạnh nội tại để tạo ra sự chuyển hóa sâu sắc. Để ứng dụng NLP hiệu quả, sự thấu hiểu cội nguồn và nguyên lý hoạt động là then chốt.",
    image: "/api/minio-proxy/innerbright/1763611178370-rxn0rl.webp",
    imageAlt: "Vì sao chọn InnerBright"
  };

  const sectionData = data || defaultData;

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-linear-to-br from-[#2851b8] via-[#3665cc] to-[#4a7cd8]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(52, 152, 219, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(74, 124, 199, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #2851b8 0%, #3665cc 50%, #4a7cd8 100%)
          `
        }}
      >
        {/* Decorative dots pattern - Left */}
        <div 
          className="absolute top-1/4 left-0 w-[120px] h-[400px] opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.6) 2px, transparent 2px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0'
          }}
        />
        
        {/* Decorative dots pattern - Right */}
        <div 
          className="absolute top-1/3 right-0 w-[100px] h-[350px] opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.5) 2px, transparent 2px)`,
            backgroundSize: '18px 18px',
            backgroundPosition: '0 0'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="text-white space-y-6 lg:space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#ffa500] leading-tight">
                {sectionData.title}
              </h2>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#ffb732] leading-snug">
                {sectionData.subtitle}
              </p>
            </div>

            {/* NLP Title */}
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {sectionData.nlpTitle}{" "}
                <span className="text-xl sm:text-2xl lg:text-3xl font-normal italic text-white/90">
                  {sectionData.nlpSubtitle}
                </span>
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-white/95">
                {sectionData.description}
              </p>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[550px]">
              {/* Decorative shape behind image */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[95%] bg-white/10 rounded-[3rem] rotate-6 blur-sm"
              ></div>
              
              {/* Main image container */}
              <div className="relative w-full aspect-16/10 rounded-[2.5rem] overflow-hidden bg-white/5 backdrop-blur-sm ring-2 ring-white/20">
                <Image
                  src={getImageUrl(sectionData.image)}
                  alt={sectionData.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 550px"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* Decorative corner accents */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#ffa500]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
