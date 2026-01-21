"use client";

import Image from "next/image";
import { Brain, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatIsNLPSection() {
    return (
        <section className="bg-white">
            {/* Top Transition Section */}
            <div className="container mx-auto px-6 lg:px-24 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[300px] lg:h-[400px] w-full"
                    >
                        <Image
                            src="/resources/nlp/hinh3.png"
                            alt="NLP Empowerment"
                            fill
                            className="object-cover rounded-2xl shadow-xl"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-4xl font-bold text-orange-500 leading-tight">
                                Nhưng bạn sẽ không nằm <br className="hidden lg:block" /> trong số đó!
                            </h2>
                            <p className="text-gray-500 font-medium text-lg italic">
                                NLP - Nguồn lực mạnh mẽ giúp bạn làm chủ cuộc đời
                            </p>
                        </div>

                        <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                            Một trong những nguồn lực tuyệt vời nhất mà mỗi người sở hữu chính là khả năng học cách làm chủ tâm trí và hiện diện trọn vẹn với thực tại. Cách chúng ta phản ứng với cuộc sống, những suy nghĩ, cảm xúc, hành động, niềm tin và giá trị theo đuổi đóng vai trò vô cùng quan trọng, tác động trực tiếp đến mọi kết quả trong cuộc đời. Và NLP chính là công cụ giúp bạn làm chủ những yếu tố then chốt này.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main WHAT IS NLP Section with Blue Background */}
            <div className="bg-[#0047ba] py-24 relative overflow-hidden">
                {/* Subtle Neural Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="50" cy="50" r="1" fill="#fff" />
                                <path d="M50 50 L100 0 M0 0 L50 50 L0 100 M50 50 L100 100" stroke="#fff" strokeWidth="0.5" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#neural-pattern)" />
                    </svg>
                </div>

                <div className="container mx-auto px-6 lg:px-24 relative z-10 text-white">
                    <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-6xl font-black uppercase tracking-tight"
                        >
                            NLP là gì?
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-xl lg:text-2xl font-medium leading-relaxed opacity-95"
                        >
                            Một cách đơn giản, thuật ngữ “Lập trình ngôn ngữ tư duy” đề cập đến những chương trình chạy ngầm trong tiềm thức, dẫn dắt hành vi và tạo ra kết quả trong cuộc sống của chúng ta.
                        </motion.p>
                    </div>

                    {/* Definition Cards */}
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Card 1: Neuro */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] p-8 lg:p-12 text-gray-800 shadow-2xl flex flex-col md:flex-row gap-8 items-start hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className="bg-blue-50 p-4 rounded-2xl shrink-0">
                                <Brain className="w-12 h-12 text-blue-600" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-2xl lg:text-3xl font-black text-blue-700">1. Neuro - Tư duy</h4>
                                <p className="text-lg leading-relaxed text-gray-600 font-medium">
                                    Hệ thống nơ-ron bộ và mạng lưới thần kinh sinh tồn. Trong con người có trung bình dao động từ 80 đến 100 tỷ nơ-ron và 100 tỷ tế bào nơ-ron thần kinh, hoạt động chính của nó là giúp chúng ta có thể tiếp nhận, xử lý thông tin. Sau đó bộ não sẽ tạo ra các thiết lập và hệ thống phản hồi làm việc một cách hiệu quả hơn trong cuộc sống.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2: Linguistic */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] p-8 lg:p-12 text-gray-800 shadow-2xl flex flex-col md:flex-row gap-8 items-start hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className="bg-green-50 p-4 rounded-2xl shrink-0">
                                <Users className="w-12 h-12 text-green-600" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-2xl lg:text-3xl font-black text-green-700">2. Linguistic - Ngôn ngữ</h4>
                                <p className="text-lg leading-relaxed text-gray-600 font-medium">
                                    Cách chúng ta sử dụng ngôn từ không chỉ đơn thuần diễn đạt ý định của chúng ta mà còn thể hiện niềm tin và thái độ của mỗi người. Một lời nói có thể mang năng lượng tích cực, có thể mang năng lượng tiêu cực, tác động mạnh mẽ đến tư duy và hành vi.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3: Programming */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] p-8 lg:p-12 text-gray-800 shadow-2xl flex flex-col md:flex-row gap-8 items-start hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className="bg-purple-50 p-4 rounded-2xl shrink-0">
                                <Settings className="w-12 h-12 text-purple-600" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-2xl lg:text-3xl font-black text-purple-700">3. Programming - Lập trình</h4>
                                <p className="text-lg leading-relaxed text-gray-600 font-medium">
                                    Tương tự như hệ điều hành máy tính, lập trình ngôn ngữ tư duy là dòng hóa các phản ứng thông tin và hành vi. Nó là một tập hợp các nguyên tắc giúp điều chỉnh các kiểu hành vi không mong muốn, đồng thời tối ưu hóa các chương trình tư duy và hành vi để đạt được hiệu quả hơn.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
