"use client";

import Image from "next/image";

export default function ProductShowcaseSection() {
  const cards = [
    { src: "/resources/nlp/card-neuro.png", alt: "Neuro Card" },
    { src: "/resources/nlp/card-linguistic.png", alt: "Linguistic Card" },
    { src: "/resources/nlp/card-programming.png", alt: "Programming Card" }
  ];

  const productImages = [
    { src: "/resources/nlp/product/p1.png", alt: "NLP Product 1" },
    { src: "/resources/nlp/product/p2.png", alt: "NLP Product 2" },
    { src: "/resources/nlp/product/p3.png", alt: "NLP Product 3" },
    { src: "/resources/nlp/product/p4.png", alt: "NLP Product 4" },
    { src: "/resources/nlp/product/p5.png", alt: "NLP Product 5" },
    { src: "/resources/nlp/product/p6.png", alt: "NLP Product 6" }
  ];

  return (
    <section className="bg-white">
      {/* Cards Introduction */}
      <div className="bg-[#f39200] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.1" />
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white uppercase mb-8">
            BỘ THẺ ỨNG DỤNG NLP HOÀN CHỈNH
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-16 leading-relaxed">
            Mỗi thẻ là một công cụ giúp bạn khai phá tiềm lực tư duy, làm chủ ngôn ngữ và lập trình lại cuộc đời theo cách bạn mong muốn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {cards.map((card, i) => (
              <div key={i} className="group relative">
                <div className="bg-white rounded-[2rem] p-6 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <h3 className="text-4xl lg:text-7xl font-black text-[#001d4a] leading-tight">
                PHÁT TRIỂN <br />
                <span className="text-[#00b4d8]">BẢN THÂN</span>
              </h3>
              <p className="text-2xl font-bold text-[#f39200]">Là sức mạnh để THAY ĐỔI THẾ GIỚI</p>
              <div className="h-1 shadow-sm w-full bg-slate-200" />
              <p className="text-xl text-slate-600 italic leading-relaxed">
                "Thế giới của mỗi người chính là hệ sinh thái, nơi mỗi chúng ta sống và làm việc. Tại InnerBright, điều quan trọng không chỉ là thành công cá nhân, mà là sử dụng sức mạnh này để tạo ra sự khác biệt."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {productImages.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Full Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productImages.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
