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
    <section className="relative h-[650px] md:h-[600px] lg:h-[650px] overflow-hidden animate-fade-in">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 animate-scale-in">
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
              <h3 className="text-2xl lg:text-7xl font-bold uppercase tracking-wide text-brand-orange">
                {currentSlideData.title}
              </h3>
              <Image
                src="/api/minio-proxy/innerbright/1763998388399-lt1gtw.svg"
                alt="Arrow decoration"
                width={120}
                height={60}
                className="w-16 h-10 sm:w-20 sm:h-12 lg:w-24 lg:h-14"
                priority
              />
            </div>


            {/* Description */}
            <div className="space-y-1">
              <h1 className="whitespace-nowrap text-4xl lg:text-[110px] font-bold">
                {currentSlideData.subtitle}
              </h1>
              <hr className="border-t border-[#FFB03E] w-2/3 mt-2 mb-4" />
              <p className="font-normal text-4xl">{currentSlideData.description}</p>
              <p className="text-4xl font-light text-white/90">{currentSlideData.subDescription}</p>
            </div>
          </div>

          {/* Right Image - Person */}
            <div className="relative h-[350px] lg:h-[550px] flex items-end justify-center lg:justify-end">
            {/* Trainer Badge with Name Background */}
            <div className="absolute bottom-0 left-0 lg:left-auto lg:right-[40%] z-10">
              {currentSlideData.nameBackground ? (
              <div className="relative">
                {/* Name Background Image */}
                <div className="relative inline-block w-[574px] h-[167px]">
                <Image
                  src={getImageUrl(currentSlideData.nameBackground)}
                  alt="Chloe Quý Châu Badge"
                  width={574}
                  height={167}
                  className="object-contain"
                  priority
                />
                {/* Text Overlay on Background Image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl text-white/90 mb-1">Bởi nhà đào tạo</p>
                  <p className="text-4xl font-bold uppercase tracking-wide text-white">
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
            <div className="relative w-full max-w-[440px] h-full">
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
