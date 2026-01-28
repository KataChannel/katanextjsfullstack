"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TeachersSection() {
    const pioneers = [
        {
            name: "Milton Erickson",
            years: "(1901-80)",
            image: "/resources/nlp/hinh11.png",
            desc: "Là một bác sĩ tâm thần, nhà trị liệu thôi miên rất thành công. NLP dựa trên cách mà Milton Erickson sử dụng ngôn ngữ thôi miên trị liệu để tạo nên các mẫu ngôn ngữ mang tên Mô hình Milton. Bất kể bạn đang ở bất cảnh nào, vai trò của bạn là gì thì những mẫu ngôn ngữ này sẽ giúp cho bạn có thể gia tăng khả năng giao tiếp với tầng tiềm thức của người nghe, thúc đẩy động lực, gây sự ảnh hưởng và tạo ra sự thay đổi."
        },
        {
            name: "Fritz Perls",
            years: "(1893-70)",
            image: "/resources/nlp/hinh12.png",
            desc: "Là một bác sĩ phẫu thuật thần kinh người Đức và nhà phân tâm học gốc Do Thái. Ông cũng là người người sáng lập ra liệu pháp Gestalt. Ông được đóng góp phát triển thành một công cụ trị liệu để phân tích tâm lý."
        },
        {
            name: "Virginia Satir",
            years: "(1916-88)",
            image: "/resources/nlp/hinh13.png",
            desc: "Được xem là bậc thầy về Liệu pháp gia đình. Virginia Satir tin rằng vai trò mà chúng ta đảm nhận trong gia đình, nơi chúng ta tồn tại là hạt giống có phản ánh hướng rất lớn đến quá trình trưởng thành. Bà tin rằng yếu tố gia đình đã góp phần tạo nên tính cách của mỗi con người. Bandler và Grinder đã sử dụng Mô hình trị liệu của Satir để tạo ra Mô hình Meta với các mẫu câu hỏi giúp tạo ra sự rõ ràng và sáng tỏ trong các vấn đề."
        }
    ];

    const successors = [
        {
            name: "TAD JAMES",
            title: "Nhà tiên phong trong lĩnh vực trị liệu dòng thời gian",
            image: "/resources/nlp/hinh14.png"
        },
        {
            name: "ROBERT DILTS",
            title: "Nhà nghiên cứu và phát triển đa tài",
            image: "/resources/nlp/hinh15.png"
        },
        {
            name: "ANTHONY ROBBINS",
            title: "Gương mặt đại diện cho NLP",
            image: "/resources/nlp/hinh16.png"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-24">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl lg:text-3xl font-bold text-[#1a56db] mb-12"
                    >
                        NLP - Hộp công cụ cuộc sống đa năng
                    </motion.h2>

                    {/* Story Quote Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto relative px-12 py-10 rounded-[2rem] bg-gray-50/50 border border-gray-100 shadow-sm"
                    >
                        <div className="absolute top-6 left-6">
                            <Quote className="w-12 h-12 text-[#f39200] opacity-80" fill="currentColor" />
                        </div>
                        <div className="absolute bottom-6 right-6 rotate-180">
                            <Quote className="w-12 h-12 text-[#f39200] opacity-80" fill="currentColor" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-2xl lg:text-3xl font-black text-gray-800 uppercase flex items-center justify-center gap-3">
                                CÂU CHUYỆN VỀ NLP <span className="text-gray-400 font-normal text-lg lg:text-xl normal-case">Lập Trình Ngôn Ngữ Tư Duy bắt đầu</span>
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                từ niềm đam mê mãnh liệt của hai nhà nghiên cứu tiên phong: Richard Bandler và John Grinder. Họ trăn trở về một câu hỏi mang tính then chốt: "Yếu tố nào tạo nên sự khác biệt giữa một cá nhân bình thường và một cá nhân xuất sắc trong cùng một lĩnh vực?". Khao khát tìm kiếm câu trả lời đã thôi thúc họ dấn thân vào hành trình nghiên cứu đầy say mê về cách con người sử dụng ngôn ngữ để phản ánh và ảnh hưởng đến tư duy của chính họ.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Pioneers Section */}
                <div className="text-center mb-16">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl lg:text-3xl font-black text-gray-800 uppercase tracking-wide"
                    >
                        NHỮNG NHÀ TIÊN PHONG TRUYỀN CẢM HỨNG
                    </motion.h3>
                </div>

                {/* Pioneers Cards Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-32">
                    {pioneers.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col items-center text-center space-y-6 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                                <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-xl lg:text-2xl font-black text-[#1a56db] uppercase">{p.name}</h4>
                                <p className="text-gray-400 font-bold">{p.years}</p>
                            </div>

                            <p className="text-gray-600 leading-relaxed font-medium text-sm lg:text-base">
                                {p.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Successors Section */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl lg:text-3xl font-black text-[#1a56db] uppercase tracking-wide"
                    >
                        NHỮNG NGƯỜI TIẾP NỐI VÀ PHÁT TRIỂN NLP
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl lg:text-2xl text-[#f39200] font-medium"
                    >
                        Chắp cánh cho một lĩnh vực mang tầm ảnh hưởng to lớn
                    </motion.p>
                </div>

                {/* Successors Grid */}
                <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {successors.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            <div className="relative group">
                                <div className="absolute -top-4 -left-4">
                                    <Quote className="w-8 h-8 text-[#f39200] opacity-60" fill="currentColor" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 rotate-180">
                                    <Quote className="w-8 h-8 text-[#f39200] opacity-60" fill="currentColor" />
                                </div>
                                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    <Image
                                        src={s.image}
                                        alt={s.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-600 font-semibold text-sm lg:text-base max-w-[200px] mx-auto">
                                    {s.title}
                                </p>
                                <h4 className="text-lg lg:text-xl font-black text-gray-800 uppercase tracking-wider">
                                    {s.name}
                                </h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
