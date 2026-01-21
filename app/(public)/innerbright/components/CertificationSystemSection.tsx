"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface Certificate {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
}

interface CertificationSystemData {
  mainTitle: string;
  yearBadge: {
    number: string;
    text: string;
  };
  description: string[];
  certificates: Certificate[];
}

interface CertificationSystemSectionProps {
  data?: CertificationSystemData;
}

export default function CertificationSystemSection({ data }: CertificationSystemSectionProps) {
  const defaultData: CertificationSystemData = {
    mainTitle: "HỆ THỐNG CHỨNG NHẬN",
    yearBadge: {
      number: "5",
      text: "NĂM"
    },
    description: [
      "InnerBright Training & Coaching tự hào là thành viên chính thức và uy tín của Hiệp Hội NLP Hoa Kỳ (ABNLP) trong hơn 5 năm liên tục. ABNLP với vai trò là tổ chức lớn nhất và lâu đời nhất về Lập Trình Ngôn Ngữ Tư Duy (NLP - Neuro Linguistic Programming) tại Hoa Kỳ, có chứng nhận sự chuyên nghiệp và chất lượng đào tạo của InnerBright.",
      "Đặc biệt, InnerBright là đơn vị tiên phong tại Việt Nam được Ban Cố Vấn (Board of Advisors) của Hiệp Hội ABNLP chứng thực bằng chương trình NLP Master Coach Quốc Tế. Điều này đảm bảo rằng không chỉ về kiến thức chuyên môn, mà còn về đạo đức nghề nghiệp, InnerBright mang đến chương trình đào tạo NLP Coaching chuẩn quốc tế tại Việt Nam."
    ],
    certificates: [
      {
        id: 1,
        title: "HỌC VIÊN ĐÀO TẠO NLP",
        image: "/innerbright/1763602544272-majm8r.webp",
        imageAlt: "Chứng chỉ Học viên Đào tạo NLP"
      },
      {
        id: 2,
        title: "HỌC VIÊN ĐÀO TẠO NLP COACHING",
        image: "/innerbright/1763602544456-bdhxwe.webp",
        imageAlt: "Chứng chỉ Học viên Đào tạo NLP Coaching"
      }
    ]
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1e4cb8] uppercase">
            {sectionData.mainTitle}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
            
            {/* Left Side - Year Badge */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start animate-fade-in-left">
              <div className="relative w-48 sm:w-56 lg:w-64">
                <Image
                  src="/innerbright/1763602103582-1nl7r.webp"
                  alt="5 năm InnerBright"
                  width={256}
                  height={340}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right Side - Description */}
            <div className="lg:col-span-9 space-y-4 text-2xl animate-fade-in-right">
              {sectionData.description.map((paragraph, index) => (
                <p 
                  key={index}
                  className={`text-base sm:text-lg lg:text-2xl leading-relaxed text-gray-700`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-fade-in-up">
            {sectionData.certificates.map((cert) => (
              <div key={cert.id} className="space-y-4">
                {/* Certificate Image */}
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden shadow-2xl ring-2 ring-gray-200 hover:ring-[#1e4cb8] transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]">
                  <Image
                    src={getImageUrl(cert.image)}
                    alt={cert.imageAlt}
                    fill
                    className="object-contain bg-white p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Certificate Title */}
                <div className="text-center">
                  <div className="h-0.5 w-96 bg-[#1e4cb8] mx-auto my-2"></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1e4cb8] uppercase">
                    {cert.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
