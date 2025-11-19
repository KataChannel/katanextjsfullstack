"use client";

import Image from "next/image";

interface TrainerData {
  badge: string;
  name: string;
  titles: string[];
  description: string[];
  image: string;
  imageAlt: string;
}

interface TrainerSectionProps {
  data?: TrainerData;
}

export default function TrainerSection({ data }: TrainerSectionProps) {
  const defaultData: TrainerData = {
    badge: "CHUYÊN GIA ĐÀO TẠO",
    name: "Chloe Quý Châu",
    titles: [
      "NLP Coach Trainer",
      "ABNLP | Time Line Therapy ®"
    ],
    description: [
      "Trong quá trình học tập và huấn luyện tại Việt Nam, Chloe Quý Châu là chuyên gia nguyên vật liệu, kiến trúc ABNLP Coaching Division cấp phép đào tạo NLP Master Coach. Chloe tập trung truyền tải nguyên bản công cụ NLP để học viên hiểu rõ, đúng, đủ và ứng dụng linh hoạt vào cuộc sống.",
      "Chloe cũng là một trong số ít người Việt đầu tiên được chứng nhận đào tạo Time Line Therapy® trực tiếp từ hiệp hội, một phương pháp mạnh mẽ giúp xử lý sâu sắc các cảm xúc"
    ],
    image: "http://116.118.49.243:12007/innerbright/1763411761425-9vst8i.webp",
    imageAlt: "Chloe Quý Châu - Chuyên gia đào tạo NLP"
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#ffb366] uppercase tracking-wide">
                {sectionData.badge}
              </p>

              {/* Name */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#ffa500] leading-tight">
                {sectionData.name}
              </h2>

              {/* Titles */}
              <div className="space-y-2">
                {sectionData.titles.map((title, index) => (
                  <p key={index} className="text-base sm:text-lg lg:text-xl text-gray-700 flex items-start gap-2">
                    <span className="text-[#ffa500] font-bold mt-1">•</span>
                    <span>{title}</span>
                  </p>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-4 lg:space-y-6 pt-4">
                {sectionData.description.map((paragraph, index) => (
                  <p key={index} className="text-base sm:text-lg leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[500px] lg:max-w-[600px]">
                {/* Decorative circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Orange circle - outer */}
                  <div 
                    className="absolute w-[90%] h-[90%] rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.3) 0%, rgba(255, 179, 102, 0.2) 100%)',
                      transform: 'scale(1.1)'
                    }}
                  ></div>
                  
                  {/* Blue circle - behind */}
                  <div 
                    className="absolute w-[85%] h-[85%] rounded-full bg-[#4a7cd8]"
                    style={{
                      transform: 'translate(-5%, 5%)',
                      zIndex: 0
                    }}
                  ></div>
                </div>

                {/* Main image container */}
                <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl ring-4 ring-white z-10">
                  <Image
                    src={sectionData.image}
                    alt={sectionData.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
