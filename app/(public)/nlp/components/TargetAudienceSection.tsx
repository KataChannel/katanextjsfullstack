"use client";

import Image from "next/image";

export default function TargetAudienceSection() {
    const targets = [
        {
            title: "LÃNH ĐẠO & QUẢN LÝ",
            desc: "Nâng cao năng lực dẫn dắt, thấu hiểu nhân sự và tối ưu hóa hiệu suất đội ngũ.",
            icon: "👥",
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "DOANH NHÂN",
            desc: "Lập trình tư duy thịnh vượng, vượt qua rào cản tài chính và bứt phá doanh thu.",
            icon: "💼",
            color: "bg-orange-100 text-orange-600"
        },
        {
            title: "CÁC BẬC PHỤ HUYNH",
            desc: "Xây dựng kết nối sâu sắc với con cái, thấu hiểu thế giới nội tâm của trẻ.",
            icon: "🏠",
            color: "bg-teal-100 text-teal-600"
        },
        {
            title: "BẤT KỲ AI MONG MUỐN THAY ĐỔI",
            desc: "Đang cảm thấy bế tắc, mất phương hướng và muốn tìm lại niềm tin cuộc sống.",
            icon: "🌟",
            color: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-[#00b4d8] font-bold tracking-widest uppercase">Nhân vật mục tiêu</h2>
                    <h3 className="text-4xl lg:text-6xl font-black text-[#001d4a] uppercase">
                        NLP DÀNH CHO <span className="text-[#f39200]">AI?</span>
                    </h3>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600 font-medium">
                        Nếu bạn thuộc một trong những nhóm dưới đây, NLP chính là chìa khóa mở ra cánh cửa thành công mới của bạn.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {targets.map((t, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-slate-100 flex flex-col items-center text-center">
                            <div className={`w-20 h-20 ${t.color} rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                {t.icon}
                            </div>
                            <h4 className="text-xl font-black text-[#001d4a] mb-4 h-14 flex items-center">
                                {t.title}
                            </h4>
                            <p className="text-slate-600 leading-relaxed">
                                {t.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Highlight Quote */}
                <div className="mt-24 p-12 lg:p-16 rounded-[4rem] bg-gradient-to-br from-[#001d4a] to-[#00b4d8] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-2xl lg:text-3xl font-light italic leading-relaxed">
                                "NLP là công cụ mạnh mẽ nhất mà tôi từng học để thấu hiểu con người và kiến tạo tương lai."
                            </p>
                            <div className="h-1 w-24 bg-[#f39200]" />
                            <div>
                                <p className="font-black text-xl">JOHN GRINDER</p>
                                <p className="text-[#f39200] font-bold">Co-founder of NLP</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="bg-white text-[#001d4a] font-black py-6 px-12 rounded-full text-xl hover:bg-[#f39200] hover:text-white transition-all transform hover:scale-110 shadow-xl">
                                TÔI MUỐN BẮT ĐẦU →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
