'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  badgeHighlight?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
}

export function Carousel({ 
  slides, 
  autoplay = true, 
  interval = 5000,
  className = '' 
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className={`relative w-full h-[500px] md:h-[600px] overflow-hidden ${className}`}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 via-blue-800/70 to-transparent" />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-white space-y-4 md:space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-orange-400 tracking-wider">
                  {slide.title}
                </h2>
                <h3 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-wide">
                  {slide.subtitle}
                </h3>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-xl">
                {slide.description}
              </p>

              {/* Badge */}
              {slide.badge && (
                <div className="inline-flex flex-col md:flex-row items-start md:items-center gap-2 bg-blue-600/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-lg">
                  <span className="text-sm md:text-base text-white">
                    {slide.badge}
                  </span>
                  {slide.badgeHighlight && (
                    <span className="text-base md:text-xl font-bold text-white tracking-wider">
                      {slide.badgeHighlight}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-6 md:w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
