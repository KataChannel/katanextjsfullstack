"use client";

import TargetIcon from "./TargetIcon";
import Image from "next/image";

interface MissionVisionData {
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  coreValues: {
    title: string;
    values: string[];
  };
}

interface MissionVisionSectionProps {
  data?: MissionVisionData;
}

export default function MissionVisionSection({ data }: MissionVisionSectionProps) {
  const defaultData: MissionVisionData = {
    mission: {
      title: "SỨ MỆNH",
      description: "Tạo dựng cuộc sống thịnh vượng hơn cho người người Việt Nam bằng việc khai phóng tiềm năng và giúp phát huy tối đa nội lực của mỗi cá nhân."
    },
    vision: {
      title: "TẦM NHÌN",
      description: "Trang bị cho mỗi người Việt Nam đủ sở hữu tư duy phát triển bản thân đúng đắn, hiệu quả và bền vững."
    },
    coreValues: {
      title: "GIÁ TRỊ CỐT LÕI",
      values: ["Hệ thống", "Hợp nhất", "Từ tế"]
    }
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#ffa500] uppercase tracking-wide">
            MANG TRONG MÌNH
          </h2>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1e4cb8] uppercase">
            KHÁT VỌNG
          </h3>
        </div>

        {/* Target Diagram */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Mission & Vision */}
            <div className="lg:col-span-4 space-y-8 lg:space-y-12">
              {/* Mission */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffa500] uppercase">
                    {sectionData.mission.title}
                  </h4>
                  <div className="h-0.5 flex-1 bg-[#ffa500]"></div>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {sectionData.mission.description}
                </p>
              </div>

              {/* Vision */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffa500] uppercase">
                    {sectionData.vision.title}
                  </h4>
                  <div className="h-0.5 flex-1 bg-[#ffa500]"></div>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {sectionData.vision.description}
                </p>
              </div>
            </div>

            {/* Center - Target Icon */}
            <div className="lg:col-span-4 flex justify-center items-center py-8 lg:py-0">
              <div className="relative w-full max-w-[400px] aspect-square">
                <Image
                  src="http://116.118.48.208:9000/innerbright/1763602095486-fn4se.webp"
                  alt="InnerBright Target Vision"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right Side - Core Values */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffa500] uppercase whitespace-nowrap">
                  {sectionData.coreValues.title}
                </h4>
                <div className="h-0.5 flex-1 bg-[#ffa500]"></div>
              </div>
              
              <ul className="space-y-4">
                {sectionData.coreValues.values.map((value, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 text-base sm:text-lg">
                    <span className="text-[#1e4cb8] font-bold text-xl mt-0.5">•</span>
                    <span className="leading-relaxed">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
