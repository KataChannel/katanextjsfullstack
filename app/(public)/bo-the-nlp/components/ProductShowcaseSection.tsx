"use client";

import Image from "next/image";

interface Card {
  id: number;
  image: string;
  number: string;
}

interface ProductImage {
  id: number;
  image: string;
  alt: string;
}

interface ProductShowcaseSectionProps {
  data?: {
    headerTitle: string;
    headerSubtitle: string;
    cards: Card[];
    mainTitle: string;
    mainSubtitle: string;
    mainHighlight: string;
    quote: string;
    productImages: ProductImage[];
  };
}

export default function ProductShowcaseSection({ data }: ProductShowcaseSectionProps) {
  const defaultData = {
    headerTitle: "BỘ THẺ ỨNG DỤNG NLP HOÀN CHỈNH",
    headerSubtitle: "Khám phá tất cả các ứng dụng NLP được thiết kế cẩn thận, mỗi thẻ được thiết kế để nâng cao kỹ năng giao tiếp và phát triển cá nhân của bạn.",
    cards: [
      {
        id: 1,
        image: "http://116.118.49.243:12007/innerbright/card-01.png",
        number: "01"
      },
      {
        id: 2,
        image: "http://116.118.49.243:12007/innerbright/card-02.png",
        number: "02"
      },
      {
        id: 3,
        image: "http://116.118.49.243:12007/innerbright/card-03.png",
        number: "03"
      },
      {
        id: 4,
        image: "http://116.118.49.243:12007/innerbright/card-04.png",
        number: "04"
      }
    ],
    mainTitle: "PHÁT TRIỂN BẢN THÂN",
    mainSubtitle: "Là sức mạnh để",
    mainHighlight: "THAY ĐỔI THẾ GIỚI",
    quote: "\"Thế giới của mỗi người chính là bề sinh thái, nơi mỗi chúng ta sống và làm việc cùng các cộng đồng. Tại InnerBright, điều quan trọng không chỉ là được thành công cá nhân, mà còn là sử dụng sức mạnh này để tạo ra sự khác biệt và ảnh hướng đến hệ sinh thái của riêng bạn. Bằng cách phát triển bản thân, chúng ta trở thành người cảm hứng và sẽ thay đổi cả thế giới cá nhân.\"",
    productImages: [
      {
        id: 1,
        image: "http://116.118.49.243:12007/innerbright/product-1.jpg",
        alt: "Bộ thẻ NLP trên bàn"
      },
      {
        id: 2,
        image: "http://116.118.49.243:12007/innerbright/product-2.jpg",
        alt: "Nhiều hộp bộ thẻ NLP"
      },
      {
        id: 3,
        image: "http://116.118.49.243:12007/innerbright/product-3.jpg",
        alt: "Bộ thẻ NLP trong hộp"
      },
      {
        id: 4,
        image: "http://116.118.49.243:12007/innerbright/product-4.jpg",
        alt: "Hộp bộ thẻ NLP màu cam"
      },
      {
        id: 5,
        image: "http://116.118.49.243:12007/innerbright/product-5.jpg",
        alt: "Nội dung thẻ NLP"
      },
      {
        id: 6,
        image: "http://116.118.49.243:12007/innerbright/product-6.jpg",
        alt: "Thẻ NLP chi tiết"
      }
    ]
  };

  const sectionData = data || defaultData;

  return (
    <section className="py-0">
      
      {/* Orange Header Section with Cards */}
      <div className="bg-linear-to-r from-orange-400 to-orange-500 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Text */}
          <div className="text-center mb-8 lg:mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {sectionData.headerTitle}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              {sectionData.headerSubtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {sectionData.cards.map((card) => (
                <div 
                  key={card.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <div className="aspect-3/4 relative">
                    <Image
                      src={card.image}
                      alt={`Card ${card.number}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Title Section */}
          <div className="text-center mb-12 lg:mb-16 space-y-3">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700">
              {sectionData.mainTitle}
            </h3>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700">
              {sectionData.mainSubtitle}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-blue-800 leading-tight">
              {sectionData.mainHighlight}
            </h2>
          </div>

          {/* Quote */}
          <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 italic leading-relaxed text-center">
              {sectionData.quote}
            </p>
          </div>

          {/* Product Images Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sectionData.productImages.map((product) => (
                <div 
                  key={product.id}
                  className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
