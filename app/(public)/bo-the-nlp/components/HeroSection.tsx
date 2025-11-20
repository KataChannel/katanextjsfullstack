"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-linear-to-br from-blue-700 via-blue-600 to-blue-800 overflow-hidden">
      {/* Large N Watermark Background */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
        <div className="text-[40rem] font-black text-white leading-none select-none">
          N
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="relative z-10 text-white space-y-6 lg:space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light">
                Bộ thẻ
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
                ỨNG DỤNG NLP
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-orange-400">
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
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg h-[500px] lg:h-[600px]">
              {/* Card Stack - 3 Real Images */}
              <div className="relative w-full h-full">
                {/* Card 3 - White/Blue (Back - Bottom Right) */}
                <div className="absolute top-20 left-[60px] w-[280px] lg:w-[340px] z-10 transform rotate-[8deg]">
                  <Image
                    src="http://116.118.49.243:12007/innerbright/1763613730899-6rsfgc.webp"
                    alt="NLP Card 3"
                    width={340}
                    height={480}
                    className="rounded-2xl shadow-2xl border-8 border-white"
                    priority
                  />
                </div>

                {/* Card 2 - Green/Teal (Middle - Center) */}
                <div className="absolute top-10 left-[30px] w-[280px] lg:w-[340px] z-20 transform -rotate-6">
                  <Image
                    src="http://116.118.49.243:12007/innerbright/1763613727282-rb4pf.webp"
                    alt="NLP Card 2"
                    width={340}
                    height={480}
                    className="rounded-2xl shadow-2xl border-8 border-white"
                    priority
                  />
                </div>

                {/* Card 1 - Orange (Front - Top Right) */}
                <div className="absolute top-0 left-0 w-[280px] lg:w-[340px] z-30 transform rotate-[9deg] hover:rotate-12 transition-transform duration-300">
                  <Image
                    src="http://116.118.49.243:12007/innerbright/1763613726960-381wim.webp"
                    alt="NLP Card 1 - Main"
                    width={340}
                    height={480}
                    className="rounded-2xl shadow-2xl border-8 border-white"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
    </section>
  );
}
