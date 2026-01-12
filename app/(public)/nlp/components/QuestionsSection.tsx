"use client";

export default function QuestionsSection() {
    const points = [
        {
            number: "1",
            text: "Tại sao tôi trở thành con người mà tôi đang là?",
        },
        {
            number: "2",
            text: "Tôi thực sự mong muốn điều gì trong cuộc đời?",
        },
        {
            number: "3",
            text: "Làm thế nào để tôi vượt qua những rào cản và đạt được điều mình mong muốn?",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-16">
                {/* Intro Box */}
                <div className="max-w-4xl mx-auto mb-20 p-10 rounded-3xl bg-orange-50 border border-orange-100 shadow-sm">
                    <h2 className="text-2xl lg:text-3xl font-black text-[#f39200] mb-4">
                        Vậy phương pháp NLP là gì?
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        NLP được khởi nguồn tại Mỹ, bởi <span className="font-bold text-[#001d4a]">John Grinder</span> (nhà ngôn ngữ học) và <span className="font-bold text-[#001d4a]">Richard Bandler</span> (nhà toán học và liệu pháp tâm lý Gestalt) với mục đích tạo ra các mô hình học tập rõ ràng về sự xuất sắc của con người.
                    </p>
                </div>

                {/* 3 Questions */}
                <div className="text-center mb-16 space-y-4">
                    <h3 className="text-4xl lg:text-6xl font-black text-[#001d4a] uppercase">
                        3 CÂU HỎI MUÔN THUỞ
                    </h3>
                    <p className="text-xl text-gray-600 font-medium italic">
                        Mỗi ngày, chúng ta đều trăn trở về những câu hỏi sâu sắc về cuộc sống:
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {points.map((point, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-8 rounded-2xl bg-[#f8fafc] border border-blue-50 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-6xl font-black text-[#00b4d8] leading-none">
                                {point.number}
                            </div>
                            <p className="text-lg lg:text-xl font-bold text-[#001d4a] leading-snug pt-2">
                                {point.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
