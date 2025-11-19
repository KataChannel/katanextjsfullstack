"use client";

import Image from "next/image";

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
      "InnerBright Training & Coaching tự hào là thành viên chính thức và uy tín của Hiệp Hội NLP Hoa Kỳ (ABNLP) trong hơn 5 năm liên tục.",
      "ABNLP",
      "Với vai trò là tổ chức lớn nhất và lâu đời nhất về Lập Trình Ngôn Ngữ Tư Duy (NLP - Neuro Linguistic Programming) tại Hoa Kỳ, có chứng nhận sự chuyên nghiệp và chất lượng đào tạo của InnerBright.",
      "Đặc biệt, InnerBright là đơn vị tiên phong tại Việt Nam được Ban Cố"
    ],
    certificates: [
      {
        id: 1,
        title: "HỌC VIÊN ĐÀO TẠO NLP",
        image: "http://116.118.49.243:12007/innerbright/certificate-nlp.jpg",
        imageAlt: "Chứng chỉ Học viên Đào tạo NLP"
      },
      {
        id: 2,
        title: "HỌC VIÊN ĐÀO TẠO NLP COACHING",
        image: "http://116.118.49.243:12007/innerbright/certificate-nlp-coaching.jpg",
        imageAlt: "Chứng chỉ Học viên Đào tạo NLP Coaching"
      }
    ]
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1e4cb8] uppercase">
            {sectionData.mainTitle}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
            
            {/* Left Side - Year Badge */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative">
                {/* Number 5 */}
                <div className="relative">
                  <svg viewBox="0 0 300 400" className="w-48 sm:w-56 lg:w-64 h-auto">
                    {/* Outline of number 5 */}
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className="fill-none stroke-[#ffa500] stroke-[8px]"
                      style={{
                        fontSize: '280px',
                        fontWeight: 'bold',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                    >
                      {sectionData.yearBadge.number}
                    </text>
                    {/* Solid number 5 */}
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className="fill-white"
                      style={{
                        fontSize: '280px',
                        fontWeight: 'bold',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                    >
                      {sectionData.yearBadge.number}
                    </text>
                  </svg>
                  
                  {/* Text "NĂM" */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#ffa500] uppercase whitespace-nowrap">
                      {sectionData.yearBadge.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Description */}
            <div className="lg:col-span-9 space-y-4">
              {sectionData.description.map((paragraph, index) => (
                <p 
                  key={index}
                  className={`text-base sm:text-lg leading-relaxed ${
                    index === 1 
                      ? 'font-bold text-gray-900' 
                      : 'text-gray-700'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {sectionData.certificates.map((cert) => (
              <div key={cert.id} className="space-y-4">
                {/* Certificate Image */}
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden shadow-2xl ring-2 ring-gray-200 hover:ring-[#1e4cb8] transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]">
                  <Image
                    src={cert.image}
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
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1e4cb8] uppercase">
                    {cert.title}
                  </h3>
                  <div className="h-1 w-24 bg-[#1e4cb8] mx-auto mt-2"></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
