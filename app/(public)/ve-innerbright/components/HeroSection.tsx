"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  subDescription: string;
  badge: string;
  image: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
}

export default function HeroSection({ slides: propSlides }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const defaultSlides: HeroSlide[] = [
    {
      id: 1,
      title: "CÂU CHUYỆN",
      subtitle: "về INNERBRIGHT",
      description: "InnerBright Training & Coaching",
      subDescription: "được thành lập từ năm 2020",
      badge: "Bởi nhà đào tạo\nCHLOE QUÝ CHÂU",
      image: "/api/minio-proxy/innerbright/1763602085989-jm48us.webp"
    }
  ];

  const slides = propSlides || defaultSlides;
  const currentSlideData = slides[currentSlide] || slides[0];

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-linear-to-br from-[#0a2351] via-[#1a3a6e] to-[#2d5aa8]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(41, 128, 185, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(52, 152, 219, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0a2351 0%, #1a3a6e 50%, #2d5aa8 100%)
          `
        }}
      >
        {/* Decorative dots pattern */}
        <div 
          className="absolute top-1/4 left-[15%] w-[200px] h-[200px] opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
          }}
        />
        <div 
          className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-12 lg:py-20">
          {/* Content */}
          <div className="text-white space-y-6 lg:space-y-8">
            {/* Story Badge */}
            <div className="flex items-center gap-3">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide bg-linear-to-r from-[#ffa500] to-[#ffb732] bg-clip-text text-transparent">
                {currentSlideData.title}
              </h3>
              <svg 
                className="w-8 h-8 sm:w-10 sm:h-10 text-[#ffa500]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                <path d="M12.59 16.59L17.17 12l-4.58-4.59L14 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                {currentSlideData.subtitle}
              </h1>
              <div className="h-1 w-[200px] sm:w-[300px] bg-linear-to-r from-[#ffa500] to-transparent mt-4"></div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-lg sm:text-xl lg:text-2xl">
              <p className="font-medium">{currentSlideData.description}</p>
              <p className="font-light">{currentSlideData.subDescription}</p>
            </div>

            {/* Trainer Badge */}
            <div className="inline-block">
              <div 
                className="bg-[#4a7cc7] bg-opacity-80 backdrop-blur-sm px-6 py-4 sm:px-8 sm:py-5 rounded-lg shadow-xl border border-[#5d8dd9]/30"
                style={{
                  boxShadow: '0 10px 40px rgba(74, 124, 199, 0.3)'
                }}
              >
                <p className="text-sm sm:text-base text-white/90 mb-1">Bởi nhà đào tạo</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide">
                  CHLOE QUÝ CHÂU
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[400px] lg:h-[600px] flex items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] lg:max-w-[600px] h-full">
              <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-[#0a2351]/20"></div>
              <Image
                src={getImageUrl(currentSlideData.image)}
                alt="Chloe Quý Châu - Nhà đào tạo InnerBright"
                fill
                className="object-contain object-bottom"
                priority
                onError={(e) => {
                  // Fallback to placeholder if image not found
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-3 h-3 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
