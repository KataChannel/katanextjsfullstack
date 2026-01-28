"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HistorySection() {
    return (
        <section className="py-24 bg-[#0047ba] overflow-hidden">
            <div className="container mx-auto px-6 lg:px-24">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight"
                    >
                        LƯỢC SỬ NLP
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-2xl relative overflow-hidden"
                >
                    <div className="relative w-full aspect-[16/9]">
                        <Image
                            src="/resources/nlp/hinh10.png"
                            alt="NLP History Diagram"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
