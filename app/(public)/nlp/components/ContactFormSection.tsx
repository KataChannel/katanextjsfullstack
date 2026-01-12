"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ lại sớm nhất!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-[#001d4a] relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="/resources/nlp/hero-bg.png"
              alt="Background Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid lg:grid-cols-2 relative z-10">
            {/* Left - Visual */}
            <div className="p-12 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-[#001d4a] to-blue-900 text-white">
              <div className="space-y-8">
                <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-300 font-bold tracking-widest text-sm">
                  LIÊN HỆ VỚI CHÚNG TÔI
                </div>
                <h2 className="text-4xl lg:text-7xl font-black leading-tight uppercase">
                  NHẬN TƯ VẤN <br />
                  <span className="text-[#f39200]">CHUYÊN SÂU</span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed max-w-md">
                  Để lại thông tin để được đội ngũ chuyên gia của chúng tôi tư vấn về lộ trình học tập và ứng dụng NLP phù hợp nhất với bạn.
                </p>

                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 mt-12">
                  <Image
                    src="/resources/nlp/product/p1.png"
                    alt="NLP Product Box"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="p-12 lg:p-20 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00b4d8] focus:bg-white transition-all outline-none text-slate-700"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00b4d8] focus:bg-white transition-all outline-none text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="09xx xxx xxx"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00b4d8] focus:bg-white transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Mục tiêu của bạn</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Bạn mong muốn đạt được điều gì thông qua NLP?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00b4d8] focus:bg-white transition-all outline-none text-slate-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f39200] hover:bg-orange-600 text-white font-black text-xl py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  GỬI THÔNG TIN ĐĂNG KÝ
                </button>

                <p className="text-sm text-center text-slate-400">
                  Chúng tôi cam kết bảo mật thông tin của bạn 100%.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-12">
          <button
            onClick={scrollToTop}
            className="group flex flex-col items-center mx-auto space-y-2 text-slate-400 hover:text-[#001d4a] transition-all"
          >
            <span className="text-2xl animate-bounce">↑</span>
            <span className="font-bold uppercase tracking-widest text-xs">Trở lại đầu trang</span>
          </button>
        </div>
      </div>
    </section>
  );
}
