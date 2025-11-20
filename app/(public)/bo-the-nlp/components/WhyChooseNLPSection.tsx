"use client";

import Image from "next/image";

interface WhyChooseNLPSectionProps {
  data?: {
    title: string;
    subtitle: string;
    reasons: string[];
    cardImages: string[];
  };
}

export default function WhyChooseNLPSection({ data }: WhyChooseNLPSectionProps) {
  const defaultData = {
    title: "Tại sao nên chọn bộ thẻ",
    subtitle: "ỨNG DỤNG NLP",
    reasons: [
      "Tham gia vào hành trình ứng dụng NLP chính là Bạn đang tham gia vào hành trình thấu hiểu bản thân, tìm thấy mục tiêu cuộc sống và làm chủ chính mình.",
      "Hãy chọn một thẻ bài bất kỳ vào mỗi ngày để đọc, chiêm nghiệm và thực hành dựa trên kiến thức, phương pháp tư duy hoặc kỹ thuật mà chiếc thẻ gợi ý."
    ],
    cardImages: [
      "http://116.118.49.243:12007/innerbright/why-card-1.png",
      "http://116.118.49.243:12007/innerbright/why-card-2.png",
      "http://116.118.49.243:12007/innerbright/why-card-3.png"
    ]
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl text-orange-500 font-medium">
                  {sectionData.title}
                </h3>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-blue-700 leading-tight">
                  {sectionData.subtitle}
                </h2>
              </div>

              {/* Reasons List */}
              <div className="space-y-6">
                {sectionData.reasons.map((reason, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    {/* Orange Bullet */}
                    <div className="shrink-0 mt-2">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-orange-500" />
                    </div>
                    
                    {/* Text */}
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Stacked Cards with Blurred Background */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Blurred Orange Background */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-300/40 to-orange-400/30 rounded-3xl blur-3xl scale-110" />
                
                {/* Cards Stack */}
                <div className="relative">
                  {/* Card 3 (Back) - Most rotated */}
                  <div className="absolute top-8 left-8 right-8 z-10 transform rotate-6 opacity-90">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white">
                      <div className="aspect-3/4 relative">
                        <Image
                          src={sectionData.cardImages[2]}
                          alt="NLP Card 3"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2 (Middle) */}
                  <div className="absolute top-4 left-4 right-4 z-20 transform -rotate-3 opacity-95">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                      <div className="aspect-3/4 relative">
                        <Image
                          src={sectionData.cardImages[1]}
                          alt="NLP Card 2"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 1 (Front) - No rotation */}
                  <div className="relative z-30">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white hover:scale-105 transition-transform duration-300">
                      <div className="aspect-3/4 relative">
                        <Image
                          src={sectionData.cardImages[0]}
                          alt="NLP Card 1"
                          fill
                          className="object-cover"
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

          </div>
        </div>

      </div>
    </section>
  );
}
