"use client";

import Image from "next/image";

interface PersonalDevelopmentData {
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  image: string;
  imageAlt: string;
}

interface PersonalDevelopmentSectionProps {
  data?: PersonalDevelopmentData;
}

export default function PersonalDevelopmentSection({ data }: PersonalDevelopmentSectionProps) {
  const defaultData: PersonalDevelopmentData = {
    title: "PHÁT TRIỂN BẢN THÂN",
    subtitle: "LÀ SỨC MẠNH ĐỂ THAY ĐỔI THẾ GIỚI",
    description: "Thế giới của mỗi người chính là bề sinh trắc, nơi mỗi chúng ta sống và làm việc cùng các cộng đồng. Tại InnerBright, điều quan trọng không chỉ là được thành công cá nhân, mà còn là sử dụng sức mạnh này để tạo ra sự khác biệt và ảnh hưởng đến hệ sinh thái của riêng bạn. Bằng cách phát triển bản thân, chúng ta tự trở thành người cảm trích và sẽ thay đổi cả thế giới.",
    highlight: "Chúng tôi - những con người tại InnerBright rất tự hào và sẵn sàng đồng hành cùng bạn trên hành trình này để khai phóng tiềm năng và giúp phát huy tối đa nội lực của riêng Bạn",
    image: "http://116.118.49.243:12007/innerbright/1763538617026-wmmtc.webp",
    imageAlt: "InnerBright - Phát triển bản thân"
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-linear-to-br from-[#ff9933] via-[#ffaa44] to-[#ffbb55] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="text-white space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase leading-tight">
                {sectionData.title}
              </h2>
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium uppercase leading-snug">
                {sectionData.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg leading-relaxed text-white/95">
                {sectionData.description}
              </p>

              {/* Highlight Text */}
              <p className="text-base sm:text-lg leading-relaxed font-semibold text-white">
                {sectionData.highlight}
              </p>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-4/3 lg:aspect-3/4">
              <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                <Image
                  src={sectionData.image}
                  alt={sectionData.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
