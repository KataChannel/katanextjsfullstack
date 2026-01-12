"use client";

import Image from "next/image";

export default function HistorySection() {
    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-[#00b4d8] font-bold tracking-widest uppercase">
                            Hành trình phát triển
                        </h2>
                        <h3 className="text-4xl lg:text-7xl font-black uppercase leading-tight">
                            LƯỢC SỬ <br />
                            <span className="text-[#f39200]">NLP</span>
                        </h3>
                        <div className="space-y-6 text-lg lg:text-xl text-slate-300 leading-relaxed">
                            <p>
                                NLP được khởi nguồn vào những năm 1970 tại Đại học California, Santa Cruz.
                                Hai nhà sáng lập John Grinder và Richard Bandler đã quan sát và mô phỏng (Modeling)
                                phong cách làm việc của 3 nhà trị liệu lỗi lạc nhất thời bấy giờ.
                            </p>
                            <p>
                                Họ nhận ra rằng dù phương pháp khác nhau, nhưng những người thành công xuất chúng
                                đều có chung những "mô thức tư duy" nhất định. Những mô thức này sau đó đã được
                                hóa thân thành hệ thống NLP toàn cầu.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">1970s ORIGINS</div>
                            <div className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">MODELING EXCELLENCE</div>
                        </div>
                    </div>

                    <div className="relative aspect-video lg:aspect-square w-full">
                        <Image
                            src="/resources/nlp/history-diagram.png"
                            alt="NLP History Diagram"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(243,146,0,0.3)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
