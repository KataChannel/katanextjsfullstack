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
        <div className="text-center mb-12 lg:mb-20 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#ffa500] uppercase tracking-wide">
            MANG TRONG MÌNH
          </h2>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1e4cb8] uppercase">
            KHÁT VỌNG
          </h3>
        </div>

        {/* Target Diagram */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative">

            {/* Left Side - Mission & Vision */}
            <div className="lg:col-span-4 space-y-8 lg:space-y-16 relative">
              {/* Mission */}
              <div className="space-y-4 relative">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffa500] uppercase">
                  {sectionData.mission.title}
                </h4>
                {/* Line from Mission to Target - diagonal down */}
                <div className="hidden lg:block absolute top-[25%] w-[625px] h-[120px] z-10">
                  <Image
                    src="/innerbright/1764353085526-xlcc7r.webp"
                    alt="Decorative line"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-700 max-w-[320px] text-base sm:text-lg leading-relaxed pr-8 lg:pr-0">
                  {sectionData.mission.description}
                </p>
              </div>

              {/* Vision */}
              <div className="space-y-4 relative pt-12">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffa500] uppercase">
                  {sectionData.vision.title}
                </h4>
                {/* Line from Vision to Target - diagonal up */}
                <div className="hidden lg:block absolute w-[150%] h-full bottom-[30%] z-10">
                  <Image
                    src="/innerbright/1764353087530-gsy3i.webp"
                    alt="Decorative line"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed pr-8 lg:pr-0">
                  {sectionData.vision.description}
                </p>
              </div>
            </div>

            {/* Center - Target Icon */}
            <div className="lg:col-span-4 flex justify-center items-center py-8 lg:py-0">
              <div className="relative w-[490px] aspect-square">
                <Image
                  src="/innerbright/1763602095486-fn4se.webp"
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
            <div className="lg:col-span-4 space-y-4 relative flex justify-between">
              {/* Line from Target to Core Values - horizontal */}
              <div className="hidden lg:block absolute w-[125%] h-full bottom-[20%] right-0 z-10">
                <Image
                  src="/innerbright/1764353089929-j8pthb.webp"
                  alt="Decorative line"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="w-full"></div>
              <div className="flex flex-col mt-[-20%]">
              <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffa500] uppercase whitespace-nowrap mb-6">
                {sectionData.coreValues.title}
              </h4>
              
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
      </div>
    </section>
  );
}
