"use client";

import Image from "next/image";

export default function WhyChooseNLPSection() {
  const reasons = [
    {
      title: "Giải phóng tiềm năng",
      desc: "Phá vỡ những niềm tin hạn chế và rào cản tâm lý để khai phá sức mạnh tiềm ẩn trong bạn.",
      icon: "🔓"
    },
    {
      title: "Giao tiếp đỉnh cao",
      desc: "Làm chủ ngôn ngữ và phi ngôn ngữ để tạo ảnh hưởng và kết nối sâu sắc với bất kỳ ai.",
      icon: "🗣️"
    },
    {
      title: "Làm chủ cảm xúc",
      desc: "Kiểm soát trạng thái tâm lý, chuyển đổi cảm cực tiêu cực sang tích cực chỉ trong vài giây.",
      icon: "⚖️"
    },
    {
      title: "Kiến tạo thành công",
      desc: "Thiết lập lộ trình tư duy của những người xuất chúng để đạt được mọi mục tiêu đề ra.",
      icon: "🏆"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[#00b4d8] font-bold tracking-widest uppercase">Lý do chọn NLP</h2>
          <h3 className="text-4xl lg:text-6xl font-black text-[#001d4a] uppercase">
            TẠI SAO NÊN <span className="text-[#f39200]">HỌC NLP?</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-[#001d4a] group transition-all duration-500 shadow-lg hover:shadow-2xl">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                {r.icon}
              </div>
              <h4 className="text-2xl font-black mb-4 group-hover:text-white transition-colors">
                {r.title}
              </h4>
              <p className="text-slate-600 group-hover:text-slate-300 transition-colors leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action Box */}
        <div className="mt-24 p-12 lg:p-20 rounded-[4rem] bg-[#001d4a] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00b4d8] rounded-full blur-[120px] opacity-20" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <h4 className="text-3xl lg:text-5xl font-black leading-tight">
                BẮT ĐẦU HÀNH TRÌNH <br />
                <span className="text-[#f39200]">THỨC TỈNH</span> CÙNG CHÚNG TÔI
              </h4>
              <p className="text-xl text-slate-300">
                Đừng để những rào cản cũ ngăn bước chân bạn. NLP là chìa khóa để bạn mở cánh cửa cuộc đời mới.
              </p>
            </div>
            <button className="whitespace-nowrap bg-[#f39200] hover:bg-orange-600 text-white font-black py-6 px-12 rounded-full text-xl transition-all transform hover:scale-110 shadow-[0_0_30px_rgba(243,146,0,0.5)]">
              ĐĂNG KÝ NGAY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
