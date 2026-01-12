"use client";

import Image from "next/image";

export default function CertificationsSection() {
    const logos = [
        { src: "/resources/nlp/abnlp-logo.png", alt: "ABNLP Logo" },
        { src: "/resources/nlp/tlta-logo.png", alt: "TLTA Logo" },
        { src: "/resources/nlp/innerbright-logo.png", alt: "InnerBright Logo" }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 lg:px-16 text-center">
                <h2 className="text-3xl lg:text-5xl font-black text-[#001d4a] uppercase mb-16">
                    CHỨNG NHẬN <span className="text-[#f39200]">QUỐC TẾ</span>
                </h2>

                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    {/* Certificates Image */}
                    <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white animate-fade-in-left">
                        <Image
                            src="/resources/nlp/abnlp-cert.png"
                            alt="ABNLP Certification"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Text & Logos */}
                    <div className="space-y-12 text-left animate-fade-in-right">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-[#001d4a]">
                                Tiêu chuẩn NLP từ hội đồng quốc tế
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Các chương trình đào tạo của chúng tôi đều tuân thủ nghiêm ngặt theo tiêu chuẩn của
                                <span className="font-bold"> ABNLP (American Board of NLP)</span> và
                                <span className="font-bold"> TLTA (Time Line Therapy Association)</span> -
                                hai hiệp hội NLP uy tín và lớn nhất thế giới hiện nay.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 items-center bg-white p-8 rounded-[2rem] shadow-lg">
                            {logos.map((logo, i) => (
                                <div key={i} className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all duration-500">
                                    <Image
                                        src={logo.src}
                                        alt={logo.alt}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
