"use client";

import Image from "next/image";

export default function WhatIsNLPSection() {
    const cards = [
        {
            title: "Neuro (Tư duy)",
            description: "Hệ thống nơ-ron bộ và mạng lưới thần kinh sinh tồn. Trong con người có trung bình dao động từ 80 đến 100 tỷ nơ-ron và 100 tỷ tế bào nơ-ron thần kinh, hoạt động chính của nó là giúp chúng ta có thể tiếp nhận, xử lý thông tin. Sau đó bộ não sẽ tạo ra các thiết lập và hệ thống phản hồi làm việc một cách hiệu quả hơn trong cuộc sống.",
            image: "/resources/nlp/card-neuro.png",
            color: "from-blue-500 to-blue-700",
            icon: "🧠"
        },
        {
            title: "Linguistic (Ngôn ngữ)",
            description: "Cách chúng ta sử dụng ngôn từ không chỉ đơn thuần diễn đạt ý định của chúng ta mà còn thể hiện niềm tin và thái độ của mỗi người. Một lời nói có thể mang năng lượng tích cực, có thể mang năng lượng tiêu cực, tác động mạnh mẽ đến tư duy và hành vi.",
            image: "/resources/nlp/card-linguistic.png",
            color: "from-teal-500 to-teal-700",
            icon: "🗣️"
        },
        {
            title: "Programming (Lập trình)",
            description: "Tương tự như hệ điều hành máy tính, lập trình ngôn ngữ tư duy là dòng hóa các phản ứng thông tin và hành vi. Nó là một tập hợp các nguyên tắc giúp điều chỉnh các kiểu hành vi không mong muốn, đồng thời tối ưu hóa các chương trình tư duy và hành vi để đạt được hiệu quả hơn.",
            image: "/resources/nlp/card-programming.png",
            color: "from-orange-500 to-orange-700",
            icon: "💻"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 lg:px-16 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-[#00b4d8] font-bold tracking-widest uppercase text-sm lg:text-base">
                        Khám phá chiều sâu
                    </h2>
                    <h3 className="text-4xl lg:text-7xl font-black text-[#001d4a] uppercase">
                        NLP LÀ GÌ?
                    </h3>
                    <div className="w-24 h-1.5 bg-[#f39200] mx-auto rounded-full" />
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-slate-100 flex flex-col"
                        >
                            {/* Image Header */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-40`} />
                                <div className="absolute bottom-6 left-8 flex items-center gap-3">
                                    <span className="text-4xl">{card.icon}</span>
                                    <h4 className="text-2xl font-black text-white drop-shadow-md">
                                        {card.title}
                                    </h4>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-10 flex-grow space-y-6">
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {card.description}
                                </p>
                            </div>

                            <div className="px-10 pb-10">
                                <div className="h-1 w-12 bg-[#00b4d8] rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
