"use client";

import { useState } from "react";

interface FoundationItem {
  id: number;
  number: string;
  title: string;
  description: string;
  color: "orange" | "blue";
}

interface FiveFoundationsData {
  mainTitle: string;
  subtitle: string;
  foundations: FoundationItem[];
}

interface FiveFoundationsSectionProps {
  data?: FiveFoundationsData;
}

export default function FiveFoundationsSection({ data }: FiveFoundationsSectionProps) {
  const defaultData: FiveFoundationsData = {
    mainTitle: "5 NỀN TẢNG TẠO NÊN SỰ KHÁC BIỆT",
    subtitle: "TRONG MỖI KHÓA HỌC TẠI INNERBRIGHT",
    foundations: [
      {
        id: 1,
        number: "1",
        title: "KHAI PHÁ TIỀM NĂNG NÃO BỘ",
        description: "Thay vì chỉ truyền tải kiến thức một chiều, chúng tôi kích hoạt bộ não của bạn để việc học trở nên tự nhiên và hiệu quả. Các phương pháp giảng dạy được thiết kế dựa trên cách bộ não tiếp thu và xử lý thông tin, giúp bạn nắm bắt kiến thức một cách sâu sắc và ghi nhớ lâu dài, giảm thiểu sự phụ thuộc vào việc ghi chép thu động.",
        color: "orange"
      },
      {
        id: 2,
        number: "2",
        title: "KHAI PHÁ TIỀM NĂNG NÃO BỘ",
        description: "Thay vì chỉ truyền tải kiến thức một chiều, chúng tôi kích hoạt bộ não của bạn để việc học trở nên tự nhiên và hiệu quả. Các phương pháp giảng dạy được thiết kế dựa trên cách bộ não tiếp thu và xử lý thông tin, giúp bạn nắm bắt kiến thức một cách sâu sắc và ghi nhớ lâu dài, giảm thiểu sự phụ thuộc vào việc ghi chép thu động.",
        color: "blue"
      },
      {
        id: 3,
        number: "3",
        title: "KHAI PHÁ TIỀM NĂNG NÃO BỘ",
        description: "Thay vì chỉ truyền tải kiến thức một chiều, chúng tôi kích hoạt bộ não của bạn để việc học trở nên tự nhiên và hiệu quả. Các phương pháp giảng dạy được thiết kế dựa trên cách bộ não tiếp thu và xử lý thông tin, giúp bạn nắm bắt kiến thức một cách sâu sắc và ghi nhớ lâu dài, giảm thiểu sự phụ thuộc vào việc ghi chép thu động.",
        color: "orange"
      },
      {
        id: 4,
        number: "4",
        title: "KHAI PHÁ TIỀM NĂNG NÃO BỘ",
        description: "Thay vì chỉ truyền tải kiến thức một chiều, chúng tôi kích hoạt bộ não của bạn để việc học trở nên tự nhiên và hiệu quả. Các phương pháp giảng dạy được thiết kế dựa trên cách bộ não tiếp thu và xử lý thông tin, giúp bạn nắm bắt kiến thức một cách sâu sắc và ghi nhớ lâu dài, giảm thiểu sự phụ thuộc vào việc ghi chép thu động.",
        color: "blue"
      },
      {
        id: 5,
        number: "5",
        title: "KHAI PHÁ TIỀM NĂNG NÃO BỘ",
        description: "Thay vì chỉ truyền tải kiến thức một chiều, chúng tôi kích hoạt bộ não của bạn để việc học trở nên tự nhiên và hiệu quả. Các phương pháp giảng dạy được thiết kế dựa trên cách bộ não tiếp thu và xử lý thông tin, giúp bạn nắm bắt kiến thức một cách sâu sắc và ghi nhớ lâu dài, giảm thiểu sự phụ thuộc vào việc ghi chép thu động.",
        color: "orange"
      }
    ]
  };

  const sectionData = data || defaultData;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate visible items based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2; // md
      return 1; // mobile
    }
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(3);

  // Update visible count on resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setVisibleCount(getVisibleCount());
    });
  }

  const maxIndex = Math.max(0, sectionData.foundations.length - visibleCount);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const getCardColor = (color: "orange" | "blue") => {
    return color === "orange"
      ? "bg-linear-to-br from-[#ff9933] to-[#ffaa44]"
      : "bg-linear-to-br from-[#2851b8] to-[#4a7cd8]";
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-orange uppercase mb-2">
            {sectionData.mainTitle}
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1e4cb8] uppercase">
            {sectionData.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            aria-label="Next"
          >
            <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
              }}
            >
              {sectionData.foundations.map((foundation) => (
                <div
                  key={foundation.id}
                  className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 lg:px-4"
                >
                  <div className={`${getCardColor(foundation.color)} rounded-3xl p-6 lg:p-8 text-white h-full shadow-xl`}>
                    {/* Number Badge */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white flex items-center justify-center">
                        <span className="text-2xl lg:text-3xl font-bold text-[#1e4cb8]">
                          {foundation.number}
                        </span>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase leading-tight">
                          {foundation.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base leading-relaxed text-white/95">
                      {foundation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[#1e4cb8] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
