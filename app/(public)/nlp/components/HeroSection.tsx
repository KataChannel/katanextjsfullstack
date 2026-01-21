"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#001d4a]">
      {/* Background Brain/Hands */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/resources/nlp/hero-nlp-bg.png"
          alt="NLP Brain and Hands Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        {/* Radial Overlay to focus center using inline style for compatibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 29, 74, 0.4) 50%, rgba(0, 29, 74, 0.9) 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center text-white">
        {/* Heading Section */}
        <div className="space-y-4 mb-8 animate-fade-in-up">
          <h1 className="text-9xl md:text-[14rem] font-black tracking-tighter leading-none drop-shadow-2xl">
            NLP
          </h1>
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight">
            Lập trình ngôn ngữ tư duy
          </h2>
        </div>

        {/* Description Section */}
        <div className="max-w-4xl mb-14 animate-fade-in-up animate-delay-200">
          <p className="text-xl md:text-3xl font-medium leading-relaxed opacity-90 drop-shadow-md">
            Khai phá sức mạnh tiềm ẩn bên trong bạn và trở thành <br className="hidden md:block" /> phiên bản xuất sắc nhất của chính mình
          </p>
        </div>

        {/* Action Button */}
        <div className="animate-fade-in-up animate-delay-500">
          <button className="group relative flex items-center gap-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-5 px-16 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(59,130,246,0.5)] shadow-blue-500/50 transform hover:scale-105 active:scale-95">
            <span className="text-xl md:text-2xl">Khám phá ngay</span>
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Extreme Bottom Gradient for transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#001d4a] to-transparent z-10" />
    </section>
  );
}
