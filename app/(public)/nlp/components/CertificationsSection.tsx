"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CertificationsSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-16 text-center">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-16">
                    {/* Left Title Section */}
                    <div className="text-left space-y-2">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl lg:text-4xl font-bold text-[#1a56db]"
                        >
                            HÀNH TRÌNH PHÁT TRIỂN
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-6xl lg:text-8xl font-black text-[#5ba4e5] tracking-tighter"
                        >
                            NĂNG LỰC
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-2xl lg:text-3xl font-bold text-gray-700"
                        >
                            CÙNG HỆ THỐNG ABNLP
                        </motion.p>
                    </div>

                    {/* Pyramid Image Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full max-w-4xl"
                    >
                        <div className="relative aspect-[16/10] w-full">
                            <Image
                                src="/resources/nlp/hinh17.png"
                                alt="Hành trình phát triển năng lực NLP"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="italic text-gray-500 text-lg lg:text-xl max-w-4xl mx-auto mb-20"
                >
                    Các chương trình đào tạo NLP tại InnerBright được bảo chứng bởi các hiệp hội uy tín quốc tế về chứng nhận và chất lượng.
                </motion.p>

                {/* Association Detail Cards */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* TLTA Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0b53d6] rounded-[3rem] p-10 lg:p-14 text-left text-white flex flex-col items-center lg:items-start space-y-10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
                    >
                        <div className="relative w-48 h-48 bg-white rounded-full p-4 shadow-lg self-center">
                            <Image
                                src="/resources/nlp/hinh18.png"
                                alt="TLTA Logo"
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                        <div className="space-y-6 w-full">
                            <div className="border-b border-white/30 pb-6">
                                <h4 className="text-xl lg:text-2xl font-bold opacity-90">Hiệp hội TLTA</h4>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">Time Line Therapy® Association</h3>
                            </div>
                            <p className="text-lg opacity-80 leading-relaxed font-medium">
                                Hiệp Hội Chuyên gia Trị liệu Dòng Thời Gian Quốc tế.
                            </p>
                        </div>
                    </motion.div>

                    {/* ABNLP Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0b53d6] rounded-[3rem] p-10 lg:p-14 text-left text-white flex flex-col items-center lg:items-start space-y-10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
                    >
                        <div className="relative w-48 h-48 bg-white rounded-full p-4 shadow-lg self-center">
                            <Image
                                src="/resources/nlp/hinh19.png"
                                alt="ABNLP Logo"
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                        <div className="space-y-6 w-full">
                            <div className="border-b border-white/30 pb-6">
                                <h4 className="text-xl lg:text-2xl font-bold opacity-90">Hiệp hội ABNLP American</h4>
                                <h3 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">Board of NLP</h3>
                            </div>
                            <p className="text-base lg:text-lg opacity-80 leading-relaxed font-medium">
                                ABNLP là hiệp hội lớn và lâu đời nhất trên thế giới, được thành lập vào năm 1982 bởi Tiến sĩ A. M. Krasner. Cho đến nay, hiệp hội ABNLP đã có hàng trăm nghìn nhà đào tạo NLP trên khắp thế giới.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
