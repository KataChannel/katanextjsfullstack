"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden animate-fade-in">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/api/minio-proxy/innerbright/1764000629425-fy0koi.webp"
          alt="Background"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="relative z-10 w-4/5 container mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="relative z-10 text-white space-y-6 lg:space-y-8 animate-fade-in-left">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light">
                Bộ thẻ
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
                ỨNG DỤNG NLP
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400">
                Neuro - Linguistic Programming
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
              <p>
                Cuộc sống của Bạn là do chính Bạn tạo ra và Lập Trình Ngôn Ngữ Tư Duy - NLP (Neuro Linguistic Programming) là chìa khóa giúp Bạn khai phá sức mạnh của bản thân để hiện thực hóa những kết quả mà Bạn mong muốn.
              </p>
            </div>
          </div>

          {/* Right Content - Cards */}
          <div className="relative z-10 flex justify-center lg:justify-end animate-fade-in-right">
            <div className="relative w-full max-w-md lg:max-w-[550px] h-[500px] lg:h-[600px]">
              {/* Card Stack - 3 Real Images */}
              <div className="relative w-full h-full">
                {/* Card 1 - Green/Teal (Back Left - Bottom) */}
                <div className="absolute bottom-5 lg:bottom-20 -left-5 w-[200px] lg:w-60 z-10 transform -rotate-25 animate-fade-in-left animate-delay-200">
                  <Image
                    src="/api/minio-proxy/innerbright/1763613727282-rb4pf.webp"
                    alt="NLP Card - Green"
                    width={240}
                    height={340}
                    className="rounded-2xl shadNeuro - Linguistic Programmingow-2xl border-[6px] lg:border-8 border-white"
                    priority
                  />
                </div>

                {/* Card 2 - Orange (Center - Main/Largest) */}
                <div className="absolute top-20 lg:top-10 left-[60px] lg:left-40 w-[260px] lg:w-[320px] z-30 transform animate-scale-in animate-delay-300">
                  <Image
                    src="/api/minio-proxy/innerbright/1763613726960-381wim.webp"
                    alt="NLP Card - Orange Main"
                    width={320}
                    height={450}
                    className="rounded-2xl shadow-2xl border-[6px] lg:border-8 border-white"
                    priority
                  />
                </div>

                {/* Card 3 - White/Blue (Front Right - Top) */}
                <div className="absolute top-10 lg:top-[150px] -right-2.5 lg:-right-28 w-[180px] lg:w-[220px] z-10 transform rotate-36 animate-fade-in-right animate-delay-400">
                  <Image
                    src="/api/minio-proxy/innerbright/1763613730899-6rsfgc.webp"
                    alt="NLP Card - White Blue"
                    width={220}
                    height={310}
                    className="rounded-2xl shadow-2xl border-[6px] lg:border-8 border-white"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
