"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-24">

                {/* Intro Section: Key to Life */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a56db] leading-[1.2]">
                            CHÌA KHOÁ MỞ RA <br />
                            CÁNH CỬA CUỘC SỐNG VƯỢT TRỘI
                        </h2>
                        <div className="space-y-4 text-lg text-gray-800 leading-relaxed font-medium">
                            <p>
                                Lập Trình Ngôn Ngữ Tư Duy NLP (Neuro Linguistic Programming) là chìa khóa giúp khai phá sức mạnh của bản thân.
                            </p>
                            <p>
                                Các nhà khoa học đã công nhận tầm quan trọng của phương pháp NLP. Nếu hiểu rõ về NLP, bạn sẽ có cơ hội phát triển bản thân lên tầm cao mới.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] w-full"
                    >
                        <Image
                            src="/resources/nlp/hinh2.png"
                            alt="NLP Key to Success"
                            fill
                            className="object-cover rounded-3xl shadow-2xl"
                        />
                    </motion.div>
                </div>

                {/* Orange Informational Box */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto mb-20 p-8 lg:p-12 rounded-[2rem] bg-[#fff0e6] relative overflow-hidden group hover:shadow-lg transition-all duration-500"
                >
                    <div className="relative z-10">
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#f26522] mb-6">
                            Vậy phương pháp NLP là gì?
                        </h3>
                        <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                            NLP được khởi nguồn tại Mỹ, bởi <span className="font-bold text-gray-900">John Grinder</span> (nhà ngôn ngữ học) và <span className="font-bold text-gray-900">Richard Bandler</span> (nhà toán học và liệu pháp tâm lý Gestalt) với mục đích tạo ra các mô hình học tập rõ ràng về sự xuất sắc của con người.
                        </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#f26522]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </motion.div>

                {/* 3 Questions Section */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-6xl font-black text-[#1a56db] uppercase tracking-tight"
                    >
                        3 CÂU HỎI MUÔN THUỞ
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-700 font-semibold"
                    >
                        Mỗi ngày, chúng ta đều trăn trở về những câu hỏi sâu sắc về cuộc sống:
                    </motion.p>
                </div>

                {/* Question Cards */}
                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {points.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-center gap-6 p-10 rounded-3xl bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="text-7xl font-black text-[#1a56db] leading-none opacity-90">
                                {point.number}
                            </div>
                            <p className="text-lg lg:text-xl font-bold text-gray-800 leading-tight">
                                {point.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="max-w-5xl mx-auto text-center space-y-4"
                >
                    <p className="text-xl lg:text-2xl text-gray-900 font-bold leading-relaxed">
                        Bạn chính là tác giả của cuộc đời mình, là đạo diễn của vở kịch mang tên “Cuộc sống” mà bạn đóng vai chính.
                    </p>
                    <p className="text-xl lg:text-2xl text-gray-900 font-bold leading-relaxed">
                        Mỗi người sinh ra đều sở hữu tiềm năng to lớn bên trong để kiến tạo cuộc sống như mong muốn.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
