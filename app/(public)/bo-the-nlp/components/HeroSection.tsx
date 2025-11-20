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
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Card Stack */}
              <div className="relative">
                {/* Card 1 - Orange (Front) */}
                <div className="relative z-30 transform rotate-6 hover:rotate-8 transition-transform duration-300">
                  <div className="bg-linear-to-br from-orange-400 to-orange-500 rounded-3xl shadow-2xl p-8 lg:p-10 border-8 border-white">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white text-6xl lg:text-7xl font-black">N</span>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl lg:text-3xl font-black text-white">
                          BỘ THẺ
                        </h3>
                        <h4 className="text-xl lg:text-2xl font-bold text-white">
                          ỨNG DỤNG
                        </h4>
                        <p className="text-sm lg:text-base text-white/90 font-medium">
                          Neuro - Linguistic Programming
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Green (Middle) */}
                <div className="absolute top-6 left-6 right-6 z-20 transform -rotate-3">
                  <div className="bg-linear-to-br from-teal-400 to-teal-500 rounded-3xl shadow-xl p-8 lg:p-10 border-8 border-white">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white">
                          <svg className="w-16 h-16 lg:w-20 lg:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl lg:text-2xl font-black text-white">
                          NLP COACHING
                        </h3>
                        <p className="text-sm lg:text-base text-white/90">
                          Bộ sưu tập trích dẫn NLP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 - White (Back) */}
                <div className="absolute top-12 left-12 right-12 z-10 transform rotate-2">
                  <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-10 border-4 border-gray-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-4xl lg:text-5xl font-black">01</span>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl lg:text-2xl font-black text-gray-800">
                          KHỞI ĐẦU
                        </h3>
                        <p className="text-sm lg:text-base text-gray-600">
                          Các nguyên tắc cơ bản của NLP
                        </p>
                      </div>
                    </div>
                  </div>
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
