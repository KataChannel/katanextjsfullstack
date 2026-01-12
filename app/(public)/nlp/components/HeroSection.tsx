"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#001d4a]">
      {/* Background Neural Network */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/resources/nlp/hero-bg.png"
          alt="Neural Network Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#001d4a] via-transparent to-transparent opacity-80" />

      <div className="container mx-auto px-6 lg:px-16 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in-left">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-widest text-[#00b4d8] uppercase">
                NLP - Lập trình
              </h2>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight">
                NGÔN NGỮ <br />
                <span className="text-[#f39200]">TƯ DUY</span>
              </h1>
              <div className="h-2 w-32 bg-[#00b4d8] rounded-full" />
            </div>

            <div className="space-y-6 text-lg lg:text-xl leading-relaxed max-w-xl text-gray-200">
              <p>
                Neuro-Linguistic Programming (NLP) là "ngôn ngữ" của não bộ.
                Hiểu được NLP là bạn đang nắm giữ chìa khóa tối thượng để làm chủ tư duy,
                giao tiếp đỉnh cao và kiến tạo cuộc đời rực rỡ.
              </p>
              <button className="bg-[#f39200] hover:bg-[#d88200] text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl uppercase tracking-wider text-sm">
                Khám phá ngay
              </button>
            </div>
          </div>

          {/* Right Content - Hero Brain/Hand */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-right">
            <div className="relative w-full max-w-[600px] aspect-square">
              <Image
                src="/resources/nlp/hero-brain.png"
                alt="Glowing Brain Representation"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(0,180,216,0.5)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave/Cut */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent invisible lg:visible" />
    </section>
  );
}
