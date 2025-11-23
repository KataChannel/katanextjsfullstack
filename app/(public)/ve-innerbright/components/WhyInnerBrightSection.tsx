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
      <div className="absolute inset-0">
        <Image
          src="/api/minio-proxy/innerbright/1763884854233-528uu.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
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
              
              {/* Main image container */}
              <div className="relative w-full rounded-[2.5rem]">
                <Image
                  src={getImageUrl(sectionData.image)}
                  alt={sectionData.imageAlt}
                  className="object-contain p-4"     
                  width={300}
                  height={400}
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
