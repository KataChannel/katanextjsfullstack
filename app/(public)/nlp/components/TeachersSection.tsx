"use client";

import Image from "next/image";

export default function TeachersSection() {
    const teachers = [
        {
            name: "Milton Erickson",
            specialty: "Thôi miên trị liệu",
            image: "/resources/nlp/milton-erickson.png",
            desc: "Người thầy vĩ đại về ngôn ngữ thôi miên và giao tiếp tầng tiềm thức."
        },
        {
            name: "Virginia Satir",
            specialty: "Trị liệu gia đình",
            image: "/resources/nlp/virginia-satir.png",
            desc: "Bậc thầy về thấu cảm và giải quyết các mâu thuẫn trong mối quan hệ."
        },
        {
            name: "Fritz Perls",
            specialty: "Trị liệu tâm lý Gestalt",
            image: "/resources/nlp/fritz-perls.png",
            desc: "Chuyên gia về việc giúp con người tỉnh thức và sống trọn vẹn ở hiện tại."
        },
        {
            name: "Tony Robbins",
            specialty: "Diễn giả hàng đầu thế giới",
            image: "/resources/nlp/tony-robbins.png",
            desc: "Người mang NLP đến hàng triệu người thông qua các chương trình thay đổi cuộc đời."
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-16">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-[#00b4d8] font-bold tracking-widest uppercase text-sm lg:text-base">
                        Những người truyền cảm hứng
                    </h2>
                    <h3 className="text-4xl lg:text-6xl font-black text-[#001d4a] uppercase">
                        NHỮNG NGƯỜI THẦY <span className="text-[#f39200]">LỖI LẠC</span>
                    </h3>
                    <p className="max-w-3xl mx-auto text-lg text-gray-500">
                        NLP được xây dựng trên nền tảng tinh hoa từ những bậc thầy thay đổi hành vi xuất sắc nhất thế giới.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teachers.map((t, i) => (
                        <div key={i} className="group relative">
                            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 group-hover:-translate-y-4">
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-2xl font-black mb-1">{t.name}</h4>
                                    <p className="text-[#00b4d8] font-bold text-sm uppercase mb-3">{t.specialty}</p>
                                </div>
                            </div>

                            <div className="mt-6 px-4">
                                <p className="text-slate-600 italic group-hover:text-[#001d4a] transition-colors">
                                    "{t.desc}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
