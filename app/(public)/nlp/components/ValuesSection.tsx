"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ValuesSection() {
    return (
        <section className="bg-white overflow-hidden pb-24">
            {/* 1. NLP - Tái cấu trúc hệ điều hành cuộc đời bạn */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-6 lg:px-24 text-center space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-4xl font-extrabold text-[#1a56db]"
                    >
                        NLP - Tái cấu trúc hệ điều hành cuộc đời bạn
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="max-w-5xl mx-auto space-y-6 text-gray-700 text-lg lg:text-xl leading-relaxed"
                    >
                        <p>
                            NLP dựa trên cơ sở bộ não của chúng ta có thể được tái cấu trúc để biến chúng ta thành những thực thể mới. Hay nói cách khác, bộ não là hệ điều hành của cuộc sống. NLP giúp thay đổi cách chúng ta nghĩ về bản thân, về người khác, về thế giới và thay thế bằng những điều hữu ích cho cuộc sống.
                        </p>
                        <p className="font-semibold text-gray-800">
                            NLP giúp tái cấu trúc những chương trình chạy ngầm bên trong, từ đó thay đổi tư duy và hành vi để đạt được hiệu quả.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. NLP - Hộp công cụ cuộc sống đa năng */}
            <div className="container mx-auto px-6 lg:px-24 py-20">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-4xl font-extrabold text-[#1a56db]"
                    >
                        NLP - Hộp công cụ cuộc sống đa năng
                    </motion.h2>
                    <p className="text-xl text-gray-500">
                        NLP là một tập hợp gồm nhiều công cụ và kỹ thuật hữu ích trang bị cho bạn khả năng
                    </p>
                </div>

                {/* Toolbox Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {/* Column 1 & 2 Left Side */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Card 1: Hieu ro ban than */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-[300px] group rounded-2xl overflow-hidden shadow-lg shadow-gray-200"
                        >
                            <Image
                                src="/resources/nlp/hinh4.png"
                                alt="Hiểu rõ bản thân"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border-l-4 border-[#1a56db]">
                                    <h4 className="font-black text-[#1a56db] mb-2 uppercase">Hiểu rõ bản thân</h4>
                                    <p className="text-sm text-gray-800 leading-tight">
                                        Nhận thức sâu sắc về chính mình, phá vỡ những rào cản nội tại và khai phá tiềm lực bên trong.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: Hieu ro nguoi khac */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-[300px] group rounded-2xl overflow-hidden shadow-lg shadow-gray-200"
                        >
                            <Image
                                src="/resources/nlp/hinh5.png"
                                alt="Hiểu rõ người khác"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border-l-4 border-[#1a56db]">
                                    <h4 className="font-black text-[#1a56db] mb-2 uppercase">Hiểu rõ người khác</h4>
                                    <p className="text-sm text-gray-800 leading-tight">
                                        Nâng cao khả năng giao tiếp, hài hòa các mối quan hệ và giúp người khác giải phóng rào cản, khơi thông nguồn lực để tiến về phía trước.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Lam chu cuoc song (Wide) */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-[300px] sm:col-span-2 group rounded-2xl overflow-hidden shadow-lg shadow-gray-200"
                        >
                            <Image
                                src="/resources/nlp/hinh6.png"
                                alt="Làm chủ cuộc sống"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6 right-6 max-w-lg">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border-l-4 border-[#1a56db]">
                                    <h4 className="font-black text-[#1a56db] mb-2 uppercase">Làm chủ cuộc sống</h4>
                                    <p className="text-sm text-gray-800 leading-tight">
                                        Thay đổi tư duy, hành vi và đạt được mục tiêu một cách hiệu quả.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 3 Right Side: Khai van - Coaching (Tall) */}
                    <div className="h-full">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative h-full min-h-[400px] group rounded-2xl overflow-hidden shadow-lg shadow-gray-200"
                        >
                            <Image
                                src="/resources/nlp/hinh7.png"
                                alt="Khai vấn - Coaching"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border-l-4 border-[#1a56db]">
                                    <h4 className="font-black text-[#1a56db] mb-3 uppercase">Khai vấn - coaching</h4>
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        Cung cấp cho bạn các mô hình, quy trình và kỹ thuật để khai vấn, thoát khỏi sự kiềm tỏa của những giới hạn bởi năng lực bên trong và áp lực bên ngoài cho chính bản thân và những người xung quanh nhằm gia tăng chất lượng cuộc sống.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 3. Tham gia chương trình đào tạo NLP */}
            <div className="container mx-auto px-6 lg:px-24 py-20 border-t border-gray-100">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left Column */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl lg:text-4xl font-extrabold text-[#1a56db] uppercase"
                            >
                                Tham gia <br /> chương trình đào tạo NLP
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-gray-800 font-medium leading-relaxed"
                            >
                                Bạn đang tham gia vào hành trình thấu hiểu bản thân, tìm thấy mục tiêu cuộc sống và làm chủ chính mình. Đây cũng là hành trình giúp Bạn chữa lành những tổn thương bên trong từ gốc rễ ở quá khứ.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative h-[400px] w-full"
                        >
                            <Image
                                src="/resources/nlp/hinh9.png"
                                alt="NLP Session"
                                fill
                                className="object-cover rounded-3xl shadow-xl"
                            />
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative h-[400px] w-full"
                        >
                            <Image
                                src="/resources/nlp/hinh8.png"
                                alt="NLP Training Class"
                                fill
                                className="object-cover rounded-3xl shadow-xl"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8 text-lg text-gray-700 leading-relaxed font-medium"
                        >
                            <p>
                                ... từ đó giúp kết nối mối quan hệ với bản thân, loại bỏ rào cản hoài nghi năng lực cá nhân, cải thiện khả năng tương tác thấu cảm với người khác; cung cấp cho bạn một loạt các chiến lược gia tăng hiệu suất cá nhân lâu dài, và một hành trình phát triển bản thân đúng đắn và toàn diện.
                            </p>
                            <p>
                                Đến nay, NLP đã phát triển các công cụ và kỹ năng rất mạnh mẽ và tạo thay đổi trong nhiều lĩnh vực chuyên môn bao gồm: tư vấn, tâm lý trị liệu, giáo dục, sức khỏe, sáng tạo, luật, quản lý, kinh doanh, thể thao.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
