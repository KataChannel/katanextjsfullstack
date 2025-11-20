"use client";

import Image from "next/image";

interface Benefit {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  data?: {
    headerText: string;
    benefits: Benefit[];
    productTitle: string;
    productDescription: string[];
    productImage: string;
  };
}

export default function BenefitsSection({ data }: BenefitsSectionProps) {
  const defaultData = {
    headerText: "InnerBright sử dụng NLP trong ba khía cạnh để giúp phát triển bản thân một cách hiệu quả.",
    benefits: [
      {
        id: 1,
        image: "http://116.118.49.243:12007/innerbright/1763613731231-h1rzn.webp",
        title: "Trở thành người giao tiếp hiệu quả",
        description: "Xây dựng những mối quan hệ chất lượng là chất liệu tạo nên hạnh phúc và thành công của bất kỳ cá nhân hay tổ chức nào."
      },
      {
        id: 2,
        image: "http://116.118.49.243:12007/innerbright/1763613734099-ak1ny.webp",
        title: "Phát huy sự tự tin",
        description: "Kết nối với mục đích sống của bản thân để sự tự tin của bạn không thể lay chuyển trong mọi tình huống."
      },
      {
        id: 3,
        image: "http://116.118.49.243:12007/innerbright/1763613736870-vnagg.webp",
        title: "Trở thành người khai phóng tiềm năng",
        description: "Phá vỡ những điểm mù, và phát huy những tiềm năng tuyệt vời từ bản thân và người khác bằng năng lực coaching."
      }
    ],
    productTitle: "Ý NGHĨA CỦA BỘ THẺ",
    productDescription: [
      "Bộ thẻ gồm 45 thẻ này là một công cụ hỗ trợ tuyệt vời cho Bạn khi thực hành NLP hoặc đang ở những bước đầu tiên quan tâm đến phương pháp chuyên hóa nội lực mạnh mẽ này.",
      "Mỗi thẻ bài chứa đựng những kiến thức, phương pháp tư duy và kỹ thuật được hệ thống hóa một cách đơn giản và dễ ghi nhớ, nhằm giúp Bạn gia tăng năng lực thấu hiểu bản thân và người khác, cải thiện chất lượng tương giao và đồng thời góp phần nâng cấp cuộc sống của Bạn và những người xung quanh."
    ],
    productImage: "http://116.118.49.243:12007/innerbright/1763613739714-0tvoj.webp"
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="max-w-5xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 leading-relaxed">
            {sectionData.headerText}
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-7xl mx-auto mb-16 lg:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {sectionData.benefits.map((benefit) => (
              <div 
                key={benefit.id}
                className="flex flex-col items-center text-center space-y-6"
              >
                {/* Circular Image */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-8 border-blue-800 shadow-xl hover:scale-105 transition-transform duration-300">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight px-4">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-sm px-4">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Meaning Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left: Product Images */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <Image
                  src={sectionData.productImage}
                  alt="Bộ thẻ ứng dụng NLP"
                  width={600}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right: Product Description */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-orange-500 leading-tight">
                {sectionData.productTitle}
              </h2>

              {/* Description Paragraphs */}
              <div className="space-y-4 lg:space-y-6">
                {sectionData.productDescription.map((paragraph, index) => (
                  <p 
                    key={index}
                    className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
