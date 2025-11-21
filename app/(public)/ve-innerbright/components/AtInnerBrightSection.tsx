"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface AtInnerBrightData {
  title: string;
  introText: string;
  mainDescription: string;
  secondaryDescription: string;
  image: string;
  imageAlt: string;
}

interface AtInnerBrightSectionProps {
  data?: AtInnerBrightData;
}

export default function AtInnerBrightSection({ data }: AtInnerBrightSectionProps) {
  const defaultData: AtInnerBrightData = {
    title: "TẠI INNERBRIGHT",
    introText: "chúng tôi không chỉ trang bị cho bạn kiến thức NLP, chúng tôi dẫn dắt bạn thực sự thấu suốt bản chất của từng công cụ. Bạn sẽ hiểu tại sao chúng hoạt động, khi nào nên sử dụng và làm thế nào để tích hợp chúng một cách linh hoạt vào cuộc sống.",
    mainDescription: "Với tầm huyết truyện tài tinh thần chính trực của NLP, InnerBright không đơn thuần mang đến một hệ thống bài bản. Chúng tôi kiến tạo một hành trình phát triển bản thân toàn diện, hấp nhất sức mạnh nội tại của bạn với sự trưởng thành ở cả bốn khía cạnh then chốt: trí tuệ lý trí (mental intelligence), trí tuệ cảm xúc (emotional intelligence), trí tuệ thể chất (physical intelligence) và trí tuệ tâm linh (spiritual intelligence).",
    secondaryDescription: "Chúng tôi nuôi dưỡng những giá trị cốt lõi của bạn, tạo nên một hệ sinh thái nội tại vững mạnh và bền vững, giúp bạn phát triển toàn diện và sống một cuộc đời trọn vẹn.",
    image: "/api/minio-proxy/innerbright/1763602544802-4u2nuh.webp",
    imageAlt: "InnerBright Team - Đội ngũ đào tạo"
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#ffa500] uppercase mb-6">
            {sectionData.title}
          </h2>
          
          {/* Intro Text */}
          <p className="max-w-5xl mx-auto text-lg sm:text-xl lg:text-2xl text-gray-500 italic leading-relaxed">
            {sectionData.introText}
          </p>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto mt-12 lg:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Side - Image */}
            <div className="relative">
              {/* Decorative border accent */}
              <div className="absolute -top-3 -left-3 w-24 sm:w-32 lg:w-40 h-1 bg-[#1e4cb8]"></div>
              <div className="absolute -top-3 -left-3 w-1 h-24 sm:h-32 lg:h-40 bg-[#ffa500]"></div>
              
              {/* Image Container */}
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                <Image
                  src={getImageUrl(sectionData.image)}
                  alt={sectionData.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right Side - Description */}
            <div className="space-y-6 lg:space-y-8">
              {/* Main Description */}
              <p className="text-base sm:text-lg leading-relaxed text-gray-600">
                {sectionData.mainDescription}
              </p>

              {/* Secondary Description */}
              <p className="text-base sm:text-lg leading-relaxed text-gray-600">
                {sectionData.secondaryDescription}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
