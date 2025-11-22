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
  avatar?: string;
  nameBackground?: string;
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
      subtitle: "Về INNERBRIGHT",
      description: "InnerBright Training & Coaching",
      subDescription: "được thành lập từ năm 2020",
      badge: "Bởi nhà đào tạo\nCHLOE QUÝ CHÂU",
      image: "/api/minio-proxy/innerbright/1763620949996-bvu1vi.webp",
      avatar: "/api/minio-proxy/innerbright/1763602085989-jm48us.webp",
      nameBackground: "/api/minio-proxy/innerbright/1763744032611-92q332.webp"
    }
  ];

  const slides = propSlides || defaultSlides;
  const currentSlideData = slides[currentSlide] || slides[0];
  
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {currentSlideData.image && (
          <Image
            src={getImageUrl(currentSlideData.image)}
            alt="InnerBright Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        )}
        {/* Dark overlay for better text contrast */}
        {/* <div className="absolute inset-0 bg-linear-to-r from-[#0a2351]/60 via-[#1a3a6e]/40 to-transparent"></div> */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-8">
          {/* Left Content */}
          <div className="text-white space-y-4 lg:space-y-6">
            {/* Title with Arrow */}
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-brand-orange">
                {currentSlideData.title}
              </h3>
              <svg 
                className="w-6 h-6 sm:w-8 sm:h-8 text-brand-orange"
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                <path d="M12.59 16.59L17.17 12l-4.58-4.59L14 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>


            {/* Description */}
            <div className="space-y-1 text-base sm:text-lg lg:text-xl">
              <h1 className="whitespace-nowrap text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {currentSlideData.subtitle}
              </h1>
              <p className="font-normal">{currentSlideData.description}</p>
              <p className="font-light text-white/90">{currentSlideData.subDescription}</p>
            </div>
          </div>

          {/* Right Image - Person */}
            <div className="relative h-[350px] lg:h-[550px] flex items-end justify-center lg:justify-end">
            {/* Trainer Badge with Name Background */}
            <div className="absolute bottom-0 left-0 lg:left-auto lg:right-[60%] z-10">
              {currentSlideData.nameBackground ? (
              <div className="relative">
                {/* Name Background Image */}
                <div className="relative w-auto inline-block">
                <Image
                  src={getImageUrl(currentSlideData.nameBackground)}
                  alt="Chloe Quý Châu Badge"
                  width={280}
                  height={90}
                  className="object-contain"
                  priority
                />
                {/* Text Overlay on Background Image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm sm:text-base text-white/90 mb-1">Bởi nhà đào tạo</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide text-white">
                  CHLOE QUÝ CHÂU
                  </p>
                </div>
                </div>
              </div>
              ) : (
              <div 
                className="bg-[#4a7cc7] bg-opacity-90 backdrop-blur-sm px-6 py-4 sm:px-8 sm:py-5 rounded-lg shadow-xl border border-[#5d8dd9]/30"
                style={{
                boxShadow: '0 10px 40px rgba(74, 124, 199, 0.3)'
                }}
              >
                <p className="text-sm sm:text-base text-white/90 mb-1">Bởi nhà đào tạo</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide">
                CHLOE QUÝ CHÂU
                </p>
              </div>
              )}
            </div>
            
            {/* Person Image */}
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] h-full">
              <Image
              src={getImageUrl(currentSlideData.avatar)}
              alt="Chloe Quý Châu - Nhà đào tạo InnerBright"
              fill
              className="object-contain object-bottom"
              priority
              quality={90}
              />
            </div>
            </div>
        </div>
      </div>

      {/* Carousel Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
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
