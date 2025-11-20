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
      "http://116.118.48.208:9000/innerbright/1763619111383-jdm9ur.webp",
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

            {/* Right - Single Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <Image
                  src="http://116.118.48.208:9000/innerbright/1763619111383-jdm9ur.webp"
                  alt="Tại sao chọn NLP"
                  width={500}
                  height={667}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
