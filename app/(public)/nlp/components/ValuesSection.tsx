"use client";

import Image from "next/image";

export default function ValuesSection() {
    const values = [
        {
            title: "HIỂU RÕ BẢN THÂN",
            description: "Nhận thức sâu sắc về chính mình, phá vỡ những rào cản nội tại và khai phá tiềm lực bên trong.",
            icon: "🧘",
            bg: "bg-blue-50",
            text: "text-blue-600"
        },
        {
            title: "THẤU HIỂU NGƯỜI KHÁC",
            description: "Cải thiện kỹ năng giao tiếp, xây dựng niềm tin và sự kết nối mạnh mẽ với mọi người xung quanh.",
            icon: "🤝",
            bg: "bg-orange-50",
            text: "text-orange-600"
        },
        {
            title: "LÀM CHỦ CUỘC SỐNG",
            description: "Thiết lập mục tiêu rõ ràng và lập trình lại tư duy để đạt được thành công bền vững.",
            icon: "🚀",
            bg: "bg-teal-50",
            text: "text-teal-600"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-16">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-6xl font-black text-[#001d4a] uppercase mb-4">
                        Giá trị NLP mang lại
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        NLP không chỉ là kiến thức, đó là bộ công cụ tối thượng để bạn tái cấu trúc cuộc đời mình theo cách bạn mong muốn.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {values.map((v, i) => (
                        <div key={i} className="group relative p-12 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-[#001d4a] overflow-hidden">
                            <div className={`w-20 h-20 ${v.bg} rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-all duration-500`}>
                                {v.icon}
                            </div>
                            <h4 className={`text-2xl font-black mb-6 group-hover:text-white transition-colors`}>
                                {v.title}
                            </h4>
                            <p className="text-lg text-slate-600 leading-relaxed group-hover:text-slate-300 transition-colors">
                                {v.description}
                            </p>

                            {/* Decorative circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                        </div>
                    ))}
                </div>

                {/* Woman in White Blazer Section (Intro to practice) */}
                <div className="mt-32 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative rounded-[3rem] overflow-hidden aspect-square lg:aspect-video shadow-2xl animate-fade-in-left">
                        <Image
                            src="/resources/nlp/woman-thinking.png"
                            alt="Professional Woman Thinking"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001d4a]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <p className="text-3xl font-black uppercase">NHƯNG BẠN SẼ <br />KHÔNG NẰM TRONG SỐ ĐÓ!</p>
                        </div>
                    </div>

                    <div className="space-y-8 animate-fade-in-right">
                        <h3 className="text-3xl lg:text-5xl font-black text-[#001d4a] leading-tight">
                            BẠN ĐÃ SẴN SÀNG ĐỂ <br />
                            <span className="text-[#f39200]">THAY ĐỔI VẬN MỆNH?</span>
                        </h3>
                        <div className="space-y-6 text-lg lg:text-xl text-slate-600 leading-relaxed">
                            <p>
                                Rất nhiều người đã học NLP nhưng vẫn chưa thể ứng dụng vào thực tế. Đó là vì họ thiếu đi công cụ rèn luyện mỗi ngày.
                            </p>
                            <div className="p-8 rounded-3xl bg-blue-50 border-l-8 border-[#00b4d8] space-y-4">
                                <p className="font-bold text-[#001d4a]">Học viện Công nghệ Cuộc sống mang đến giải pháp:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#00b4d8]">✔</span>
                                        Thực hành 2 phút mỗi ngày
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#00b4d8]">✔</span>
                                        Công cụ "Remote" điều khiển tư duy
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#00b4d8]">✔</span>
                                        Chuyển kênh cảm cực tức thì
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
