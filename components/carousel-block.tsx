'use client';

import { Carousel } from '@/components/carousel';

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  badgeHighlight?: string;
}

interface CarouselBlockProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
}

export function CarouselBlock({ slides, autoplay = true, interval = 5000 }: CarouselBlockProps) {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <Carousel 
        slides={slides}
        autoplay={autoplay}
        interval={interval}
      />
    </div>
  );
}
