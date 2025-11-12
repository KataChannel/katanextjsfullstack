'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CarouselSlide } from '@/lib/page-builder/store';

interface CarouselComponentProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: number;
  className?: string;
}

/**
 * Carousel Component
 * Auto-play, dots navigation, arrow controls
 * Mobile First + Responsive
 */
export function CarouselComponent({
  slides = [],
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  height = 500,
  className,
}: CarouselComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto play
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, slides.length]);

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentIndex]);

  if (!slides || slides.length === 0) {
    return (
      <div 
        className={cn("relative w-full bg-gray-200 flex items-center justify-center", className)}
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">Chưa có slides</p>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative w-full overflow-hidden group", className)}
      style={{ height: `${height}px` }}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-500 ease-in-out",
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            )}
          >
            {/* Image */}
            <img
              src={slide.image}
              alt={slide.alt || slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay Content */}
            {(slide.title || slide.description) && (
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent flex items-end">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
                  <div className="max-w-2xl">
                    {slide.title && (
                      <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 animate-fade-in">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-sm sm:text-base lg:text-xl text-white/90 animate-fade-in animation-delay-200">
                        {slide.description}
                      </p>
                    )}
                    {slide.link && (
                      <a
                        href={slide.link}
                        className="inline-block mt-4 sm:mt-6 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors animate-fade-in animation-delay-400"
                      >
                        Tìm hiểu thêm
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrow Controls - Hidden on mobile, visible on hover desktop */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className={cn(
              "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white",
              "flex items-center justify-center shadow-lg",
              "transition-all duration-300",
              "opacity-0 group-hover:opacity-100",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            disabled={isTransitioning}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={handleNext}
            className={cn(
              "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white",
              "flex items-center justify-center shadow-lg",
              "transition-all duration-300",
              "opacity-0 group-hover:opacity-100",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            disabled={isTransitioning}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "transition-all duration-300",
                  "rounded-full",
                  index === currentIndex
                    ? "w-8 sm:w-10 h-2 bg-white"
                    : "w-2 h-2 bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
