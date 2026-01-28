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
                    className="italic text-gray-500 text-lg lg:text-xl max-w-4xl mx-auto"
                >
                    Các chương trình đào tạo NLP tại InnerBright được bảo chứng bởi các hiệp hội uy tín quốc tế về chứng nhận và chất lượng.
                </motion.p>
            </div>
        </section>
    );
}
