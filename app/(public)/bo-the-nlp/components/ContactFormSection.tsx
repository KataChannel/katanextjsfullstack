"use client";

import Image from "next/image";
import { useState } from "react";

interface ContactFormSectionProps {
  data?: {
    formTitle: string;
    formSubtitle: string;
    productImage: string;
    placeholders: {
      name: string;
      email: string;
      phone: string;
      message: string;
    };
    submitButtonText: string;
    backToTopText: string;
  };
}

export default function ContactFormSection({ data }: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const defaultData = {
    formTitle: "FROM ĐĂNG KÝ",
    formSubtitle: "ĐĂNG KÝ NHẬN TƯ VẤN",
    productImage: "/api/minio-proxy/innerbright/1763613751013-p217o.webp",
    placeholders: {
      name: "Họ tên (Bắt buộc)",
      email: "Email (Bắt buộc)",
      phone: "SĐT (Bắt buộc)",
      message: "Họ tên (không bắt buộc)"
    },
    submitButtonText: "GỬI THÔNG TIN",
    backToTopText: "Trở lại đầu trang"
  };

  const sectionData = data || defaultData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Card */}
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-3xl lg:rounded-[3rem] p-6 sm:p-8 lg:p-12 shadow-2xl animate-fade-in-up">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left - Product Image */}
            <div className="order-2 lg:order-1 animate-fade-in-left">
              <div className="relative aspect-4/3 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={sectionData.productImage}
                  alt="Bộ thẻ NLP Products"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right - Form */}
            <div className="order-1 lg:order-2 animate-fade-in-right">
              <div className="space-y-6 lg:space-y-8">
                
                {/* Form Header */}
                <div className="text-center space-y-2">
                  <p className="text-base sm:text-lg text-white font-medium">
                    | {sectionData.formTitle} |
                  </p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-400">
                    {sectionData.formSubtitle}
                  </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                  <div className="bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 space-y-4 lg:space-y-5">
                    
                    {/* Name Input */}
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={sectionData.placeholders.name}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base text-gray-700 placeholder:text-gray-400"
                    />

                    {/* Email Input */}
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={sectionData.placeholders.email}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base text-gray-700 placeholder:text-gray-400"
                    />

                    {/* Phone Input */}
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder={sectionData.placeholders.phone}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base text-gray-700 placeholder:text-gray-400"
                    />

                    {/* Message Textarea */}
                    <textarea
                      name="message"
                      rows={4}
                      placeholder={sectionData.placeholders.message}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base text-gray-700 placeholder:text-gray-400 resize-none"
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-black text-lg lg:text-xl py-4 lg:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      {sectionData.submitButtonText}
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-12 lg:mt-16">
          <button
            onClick={scrollToTop}
            className="text-base sm:text-lg text-white/80 hover:text-white italic transition-colors duration-300 underline"
          >
            {sectionData.backToTopText}
          </button>
        </div>

      </div>
    </section>
  );
}
