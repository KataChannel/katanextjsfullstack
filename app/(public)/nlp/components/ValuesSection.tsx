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
            <div className="container mx-auto px-6 lg:px-24 py-24">
                <div className="text-center mb-16 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-black text-[#001d4a]"
                    >
                        NLP - Hộp công cụ cuộc sống đa năng
                    </motion.h2>
                    <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto">
                        NLP là một tập hợp gồm nhiều công cụ và kỹ thuật hữu ích trang bị cho bạn khả năng
                    </p>
                </div>

                {/* Toolbox Grid - Fixed Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1400px] mx-auto items-stretch">

                    {/* Column 1: Vertically Stacked Small Cards (3/12 width) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-8">
                        {/* Card 1: HIỂU RÕ BẢN THÂN */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-[300px] lg:h-[350px] group rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/resources/nlp/hinh4.png"
                                alt="Hiểu rõ bản thân"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl text-center shadow-lg border border-white/40">
                                    <h4 className="font-black text-[#1a56db] mb-2 text-sm lg:text-base uppercase">HIỂU RÕ BẢN THÂN</h4>
                                    <p className="text-xs lg:text-sm text-gray-700 font-semibold leading-relaxed">
                                        Nhận thức sâu sắc về chính mình, phá vỡ những rào cản nội tại và khai phá tiềm lực bên trong.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: LÀM CHỦ CUỘC SỐNG */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-[300px] lg:h-[220px] group rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/resources/nlp/hinh6.png"
                                alt="Làm chủ cuộc sống"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl text-center shadow-lg border border-white/40">
                                    <h4 className="font-black text-[#1a56db] mb-2 text-sm lg:text-base uppercase">LÀM CHỦ CUỘC SỐNG</h4>
                                    <p className="text-xs lg:text-sm text-gray-700 font-semibold leading-relaxed">
                                        Thay đổi tư duy, hành vi và đạt được mục tiêu một cách hiệu quả.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 2: HIỂU RÕ NGƯỜI KHÁC (3/12 width) */}
                    <div className="lg:col-span-3">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-[400px] lg:h-full group rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/resources/nlp/hinh5.png"
                                alt="Hiểu rõ người khác"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div className="backdrop-blur-md bg-white/70 p-6 rounded-2xl text-center shadow-lg border border-white/40">
                                    <h4 className="font-black text-[#1a56db] mb-3 text-sm lg:text-base uppercase">HIỂU RÕ NGƯỜI KHÁC</h4>
                                    <p className="text-xs lg:text-sm text-gray-700 font-semibold leading-relaxed">
                                        Nâng cao khả năng giao tiếp, hài hòa các mối quan hệ và giúp người khác giải phóng rào cản, khơi thông nguồn lực để tiến về phía trước.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 3: KHAI VẤN - COACHING (Tall & Wide, 6/12 width) */}
                    <div className="lg:col-span-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-[500px] lg:h-full group rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/resources/nlp/hinh7.png"
                                alt="Khai vấn - Coaching"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-end p-6 lg:p-10">
                                <div className="backdrop-blur-xl bg-white/70 p-6 lg:p-8 rounded-3xl shadow-xl border border-white/50 w-full lg:max-w-[90%]">
                                    <h4 className="font-black text-[#1a56db] mb-3 text-lg lg:text-xl uppercase">KHAI VẤN - COACHING</h4>
                                    <p className="text-sm lg:text-base text-gray-700 font-semibold leading-relaxed">
                                        Cung cấp cho bạn các mô hình, quy trình và kỹ thuật để khai vấn, thoát khỏi sự kiềm tỏa của những giới hạn bởi năng lực bên trong và áp lực bên ngoài cho chính bản thân và những người xung quanh nhằm gia tăng chất lượng cuộc sống.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 3. Tham gia chương trình đào tạo NLP */}
            <div className="container mx-auto px-6 lg:px-24 py-24 border-t border-gray-100">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left Column */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl lg:text-4xl font-black text-[#2563eb] leading-tight"
                            >
                                THAM GIA <br /> CHƯƠNG TRÌNH ĐÀO TẠO NLP
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="text-lg lg:text-xl text-gray-800 font-medium leading-relaxed"
                            >
                                Bạn đang tham gia vào hành trình thấu hiểu bản thân, tìm thấy mục tiêu cuộc sống và làm chủ chính mình. Đây cũng là hành trình giúp Bạn chữa lành những tổn thương bên trong từ gốc rễ ở quá khứ.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[300px] lg:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/resources/nlp/hinh9.png"
                                alt="NLP Session"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative h-[300px] lg:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/resources/nlp/hinh8.png"
                                alt="NLP Training Class"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6 text-base lg:text-lg text-gray-700 leading-relaxed font-medium"
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
