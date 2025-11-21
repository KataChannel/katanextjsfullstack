import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // 1. Tạo users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tazagroup.vn' },
    update: {},
    create: {
      email: 'admin@tazagroup.vn',
      name: 'Admin Taza',
      role: 'admin',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@tazagroup.vn' },
    update: {},
    create: {
      email: 'editor@tazagroup.vn',
      name: 'Editor Taza',
      role: 'editor',
    },
  });

  console.log('✅ Đã tạo users:', { admin: admin.email, editor: editor.email });

  // 2. Tạo Website Settings
  const websiteSettings = await prisma.websiteSettings.upsert({
    where: { domain: 'tazagroup.vn' },
    update: {},
    create: {
      domain: 'tazagroup.vn',
      siteName: 'Taza Group',
      metaTitle: 'Taza Group - Hệ thống thẩm mỹ viện và spa hàng đầu Việt Nam',
      metaDescription: 'Taza Group - Hệ thống thẩm mỹ viện và spa hàng đầu Việt Nam với công nghệ tiên tiến',
      siteKeywords: 'thẩm mỹ viện, spa, làm đẹp, chăm sóc da',
      siteOgImage: '/images/og-default.jpg',
      twitterHandle: '@tazagroup',
      googleAnalytics: 'G-XXXXXXXXXX',
      organizationSchema: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Taza Group',
        url: 'https://tazagroup.vn',
        logo: 'https://tazagroup.vn/logo.png',
      },
    },
  });

  console.log('✅ Đã tạo Website Settings cho:', websiteSettings.domain);

  // 2b. Tạo Website Settings cho innerbright.vn
  const innerbrightSettings = await prisma.websiteSettings.upsert({
    where: { domain: 'innerbright.vn' },
    update: {
      homeRedirect: '/ve-innerbright',
    },
    create: {
      domain: 'innerbright.vn',
      siteName: 'InnerBright Training & Coaching',
      metaTitle: 'InnerBright - Đào tạo NLP & Coaching chuyên nghiệp',
      metaDescription: 'InnerBright Training & Coaching - Đào tạo NLP và Coaching chuyên nghiệp, chứng nhận ABNLP',
      siteKeywords: 'NLP, coaching, đào tạo NLP, ABNLP, phát triển bản thân',
      siteOgImage: '/images/innerbright-og.jpg',
      twitterHandle: '@innerbright',
      googleAnalytics: 'G-XXXXXXXXXX',
      homeRedirect: '/ve-innerbright',
      organizationSchema: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'InnerBright Training & Coaching',
        url: 'https://innerbright.vn',
        logo: 'https://innerbright.vn/logo.png',
      },
    },
  });

  console.log('✅ Đã tạo Website Settings cho:', innerbrightSettings.domain, '- Trang chủ:', innerbrightSettings.homeRedirect);

  // 3. Tạo Posts
  const posts = [
    {
      title: 'Top 10 Xu Hướng Làm Đẹp 2025',
      slug: 'top-10-xu-huong-lam-dep-2025',
      content: `
        <h2>Xu hướng làm đẹp năm 2025</h2>
        <p>Năm 2025 đánh dấu sự phát triển vượt bậc của ngành làm đẹp với nhiều công nghệ tiên tiến.</p>
        <h3>1. Công nghệ AI trong tư vấn làm đẹp</h3>
        <p>Trí tuệ nhân tạo đang cách mạng hóa cách chúng ta tiếp cận làm đẹp...</p>
        <h3>2. Skincare tối giản</h3>
        <p>Less is more - xu hướng chăm sóc da tối giản đang lên ngôi...</p>
      `,
      excerpt: 'Khám phá 10 xu hướng làm đẹp nổi bật nhất năm 2025 từ các chuyên gia hàng đầu.',
      published: true,
      metaTitle: 'Top 10 Xu Hướng Làm Đẹp 2025 | Taza Group',
      metaDescription: 'Cập nhật 10 xu hướng làm đẹp hot nhất 2025: công nghệ AI, skincare tối giản, và nhiều hơn nữa từ chuyên gia Taza Group.',
      metaKeywords: 'xu hướng làm đẹp 2025, beauty trends, công nghệ làm đẹp',
      ogType: 'article',
      authorId: admin.id,
    },
    {
      title: 'Bí Quyết Chăm Sóc Da Mùa Đông Hiệu Quả',
      slug: 'bi-quyet-cham-soc-da-mua-dong',
      content: `
        <h2>Chăm sóc da mùa đông đúng cách</h2>
        <p>Mùa đông làn da dễ bị khô, nứt nẻ do thời tiết lạnh và độ ẩm thấp.</p>
        <h3>Bước 1: Làm sạch nhẹ nhàng</h3>
        <p>Sử dụng sữa rửa mặt dịu nhẹ, không chứa sulfate...</p>
        <h3>Bước 2: Dưỡng ẩm sâu</h3>
        <p>Chọn kem dưỡng giàu ceramide và hyaluronic acid...</p>
      `,
      excerpt: 'Hướng dẫn chi tiết cách chăm sóc da mùa đông để duy trì làn da khỏe đẹp, rạng rỡ.',
      published: true,
      metaTitle: 'Bí Quyết Chăm Sóc Da Mùa Đông | Taza Group',
      metaDescription: 'Khám phá bí quyết chăm sóc da mùa đông hiệu quả với hướng dẫn từ chuyên gia. Giữ da mềm mại, căng bóng suốt mùa lạnh.',
      metaKeywords: 'chăm sóc da mùa đông, skincare, dưỡng da',
      ogType: 'article',
      authorId: editor.id,
    },
    {
      title: 'Liệu Trình Trẻ Hóa Da Bằng Công Nghệ Laser',
      slug: 'lieu-trinh-tre-hoa-da-bang-cong-nghe-laser',
      content: `
        <h2>Công nghệ Laser trong trẻ hóa da</h2>
        <p>Laser là một trong những phương pháp trẻ hóa da hiện đại và hiệu quả nhất hiện nay.</p>
        <h3>Các loại Laser phổ biến</h3>
        <ul>
          <li>Fractional CO2 Laser</li>
          <li>Q-Switch Laser</li>
          <li>Pico Laser</li>
        </ul>
      `,
      excerpt: 'Tìm hiểu về công nghệ laser tiên tiến giúp trẻ hóa da, mờ nám, se khít lỗ chân lông an toàn.',
      published: true,
      metaTitle: 'Liệu Trình Trẻ Hóa Da Laser | Taza Skin Clinic',
      metaDescription: 'Công nghệ laser tiên tiến cho làn da trẻ trung. Tư vấn miễn phí, cam kết hiệu quả tại Taza Skin Clinic.',
      metaKeywords: 'trẻ hóa da laser, laser da, công nghệ làm đẹp',
      ogType: 'article',
      authorId: admin.id,
    },
    {
      title: 'Cách Chọn Serum Phù Hợp Với Từng Loại Da',
      slug: 'cach-chon-serum-phu-hop-voi-tung-loai-da',
      content: `
        <h2>Hướng dẫn chọn Serum</h2>
        <p>Serum là bước quan trọng trong quy trình chăm sóc da hàng ngày.</p>
        <h3>Da khô</h3>
        <p>Nên chọn serum chứa Hyaluronic Acid, Ceramide...</p>
        <h3>Da dầu</h3>
        <p>Ưu tiên serum có Niacinamide, Salicylic Acid...</p>
      `,
      excerpt: 'Bí quyết lựa chọn serum phù hợp với từng loại da để đạt hiệu quả tối ưu trong chăm sóc da.',
      published: true,
      metaTitle: 'Cách Chọn Serum Phù Hợp | Taza Beauty Tips',
      metaDescription: 'Hướng dẫn chi tiết cách chọn serum cho da khô, da dầu, da hỗn hợp và da nhạy cảm.',
      metaKeywords: 'chọn serum, serum là gì, chăm sóc da',
      ogType: 'article',
      authorId: editor.id,
    },
    {
      title: 'Giải Đáp Thắc Mắc Về Tiêm Filler Môi',
      slug: 'giai-dap-thac-mac-ve-tiem-filler-moi',
      content: `
        <h2>Tất tần tật về Filler môi</h2>
        <p>Filler môi là phương pháp thẩm mỹ phổ biến để cải thiện hình dáng đôi môi.</p>
        <h3>Quy trình tiêm Filler</h3>
        <p>Tư vấn → Vẽ thiết kế → Gây tê → Tiêm Filler → Chăm sóc sau...</p>
      `,
      excerpt: 'Giải đáp mọi thắc mắc về tiêm filler môi: quy trình, giá cả, thời gian duy trì và lưu ý.',
      published: true,
      metaTitle: 'Tiêm Filler Môi - Giải Đáp Thắc Mắc | Taza Clinic',
      metaDescription: 'Tư vấn chi tiết về tiêm filler môi: quy trình chuẩn y khoa, bác sĩ giàu kinh nghiệm tại Taza.',
      metaKeywords: 'tiêm filler môi, filler môi, thẩm mỹ môi',
      ogType: 'article',
      authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log(`✅ Đã tạo ${posts.length} bài viết`);

  // 4. Tạo Pages
  const pages = [
    {
      title: 'Về Chúng Tôi',
      slug: 've-chung-toi',
      content: `
        <h1>Về Taza Group</h1>
        <p>Taza Group là hệ thống thẩm mỹ viện và spa hàng đầu Việt Nam với hơn 10 năm kinh nghiệm.</p>
        <h2>Sứ mệnh</h2>
        <p>Mang đến vẻ đẹp tự nhiên và sự tự tin cho mọi người thông qua các dịch vụ chăm sóc sức khỏe và sắc đẹp chất lượng cao.</p>
        <h2>Giá trị cốt lõi</h2>
        <ul>
          <li>Chất lượng dịch vụ hàng đầu</li>
          <li>Công nghệ tiên tiến</li>
          <li>Đội ngũ chuyên gia giàu kinh nghiệm</li>
          <li>An toàn tuyệt đối</li>
        </ul>
      `,
      published: true,
      metaTitle: 'Về Chúng Tôi - Taza Group',
      metaDescription: 'Tìm hiểu về Taza Group - hệ thống thẩm mỹ viện uy tín với 10+ năm kinh nghiệm, công nghệ hiện đại và đội ngũ chuyên gia.',
      metaKeywords: 'về taza group, thẩm mỹ viện taza, spa taza',
      ogType: 'website',
      authorId: admin.id,
    },
    {
      title: 'Dịch Vụ',
      slug: 'dich-vu',
      content: `
        <h1>Dịch Vụ Của Chúng Tôi</h1>
        <h2>Chăm sóc da</h2>
        <ul>
          <li>Điều trị mụn</li>
          <li>Trị nám, tàn nhang</li>
          <li>Trẻ hóa da</li>
        </ul>
        <h2>Thẩm mỹ</h2>
        <ul>
          <li>Tiêm Filler</li>
          <li>Tiêm Botox</li>
          <li>Nâng cơ chỉ</li>
        </ul>
        <h2>Spa & Massage</h2>
        <ul>
          <li>Massage body</li>
          <li>Chăm sóc toàn thân</li>
          <li>Thư giãn trị liệu</li>
        </ul>
      `,
      published: true,
      metaTitle: 'Dịch Vụ Thẩm Mỹ & Spa | Taza Group',
      metaDescription: 'Khám phá đa dạng dịch vụ chăm sóc da, thẩm mỹ và spa tại Taza Group với công nghệ hiện đại và đội ngũ chuyên nghiệp.',
      metaKeywords: 'dịch vụ thẩm mỹ, spa, chăm sóc da',
      ogType: 'website',
      authorId: admin.id,
    },
    {
      title: 'Liên Hệ',
      slug: 'lien-he',
      content: `
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <h2>Thông tin liên hệ</h2>
        <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
        <p><strong>Điện thoại:</strong> 1900 xxxx</p>
        <p><strong>Email:</strong> contact@tazagroup.vn</p>
        <p><strong>Giờ làm việc:</strong> 8:00 - 20:00 (Thứ 2 - Chủ nhật)</p>
      `,
      published: true,
      metaTitle: 'Liên Hệ | Taza Group',
      metaDescription: 'Liên hệ với Taza Group để được tư vấn miễn phí về các dịch vụ thẩm mỹ và chăm sóc sắc đẹp.',
      metaKeywords: 'liên hệ taza, tư vấn thẩm mỹ, đặt lịch',
      ogType: 'website',
      authorId: admin.id,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log(`✅ Đã tạo ${pages.length} trang`);

  console.log('🎉 Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
