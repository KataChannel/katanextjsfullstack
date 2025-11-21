"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface Certification {
  id: number;
  logo: string;
  name: string;
  description: string;
}

interface CertificationsData {
  headerText: string;
  certifications: Certification[];
  backToTopText: string;
}

interface CertificationsSectionProps {
  data?: CertificationsData;
}

export default function CertificationsSection({ data }: CertificationsSectionProps) {
  const defaultData: CertificationsData = {
    headerText: "Hành trình chuyên nghiệp của Chloe được xây dựng trên nền tảng kinh nghiệm khai vấn (coaching) được chứng nhận bởi hàng loạt các tổ chức uy tín trên thế giới, bao gồm:",
    certifications: [
      {
        id: 1,
        logo: "/api/minio-proxy/innerbright/1763602554133-uyfzx.webp",
        name: "HIỆP HỘI ABNLP",
        description: "Chứng nhận năng lực khai vấn bằng công cụ NLP."
      },
      {
        id: 2,
        logo: "/api/minio-proxy/innerbright/1763602554318-301m9.webp",
        name: "TỔ CHỨC HUẤN LUYỆN DOANH NGHIỆP ACTIONCOACH",
        description: "Chứng nhận khả năng huấn luyện và phát triển doanh nghiệp."
      },
      {
        id: 3,
        logo: "/api/minio-proxy/innerbright/1763602560452-zahjek.webp",
        name: "HIỆP HỘI TIME LINE THERAPY®",
        description: "Chứng nhận năng lực trị liệu và khai vấn bằng kỹ thuật Time Line Therapy."
      },
      {
        id: 4,
        logo: "/api/minio-proxy/innerbright/1763602561852-kd2qgi.webp",
        name: "TƯ VẤN HÌNH ẢNH FIRST IMPRESSIONS IMAGE INTERNATIONAL (SINGAPORE)",
        description: "Mở rộng phạm vi chuyên môn, hỗ trợ sự phát triển toàn diện cho cá nhân và doanh nghiệp."
      }
    ],
    backToTopText: "Trở lại đầu trang"
  };

  const sectionData = data || defaultData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="max-w-5xl mx-auto text-center mb-12 lg:mb-16">
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 italic leading-relaxed">
            {sectionData.headerText}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {sectionData.certifications.map((cert) => (
              <div 
                key={cert.id}
                className="bg-gray-100 rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center space-y-4 hover:bg-gray-50 transition-colors duration-300 hover:shadow-lg"
              >
                {/* Logo */}
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center">
                  <Image
                    src={getImageUrl(cert.logo)}
                    alt={cert.name}
                    width={160}
                    height={160}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase leading-tight min-h-12 flex items-center justify-center">
                  {cert.name}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-12 lg:mt-16">
          <button
            onClick={scrollToTop}
            className="text-base sm:text-lg text-gray-500 italic hover:text-gray-700 transition-colors duration-300 underline"
          >
            {sectionData.backToTopText}
          </button>
        </div>

      </div>
    </section>
  );
}
