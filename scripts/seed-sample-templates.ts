/**
 * Seed more sample templates for BlockTemplateV2
 * Creates hero, CTA, and feature section templates
 */

import { getPrisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Seeding sample templates for innerbright.vn...\n');

  const prisma = await getPrisma();

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'katachanneloffical@gmail.com' },
        { email: 'admin@tazagroup.vn' },
        { role: 'admin' }
      ]
    },
  });

  if (!adminUser) {
    console.error('❌ Admin user not found');
    return;
  }

  console.log(`✅ Using admin: ${adminUser.email}\n`);

  // Template 1: Hero Banner with CTA
  const heroTemplate = await prisma.blockTemplateV2.create({
    data: {
      name: 'Hero Banner với CTA',
      description: 'Hero section đơn giản với tiêu đề lớn và nút call-to-action',
      category: 'template',
      tags: ['hero', 'banner', 'cta'],
      published: true,
      downloads: 0,
      authorId: adminUser.id,
      block: {
        type: 'html',
        content: {
          html: `
<div class="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
      Chào mừng đến với Innerbright
    </h1>
    <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
      Giải pháp tốt nhất cho sự phát triển bản thân và tâm linh của bạn
    </p>
    <button class="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
      Khám phá ngay
    </button>
  </div>
</div>
          `.trim()
        },
        styles: {
          container: 'w-full'
        }
      },
    },
  });
  console.log(`✅ Created: ${heroTemplate.name} (${heroTemplate.id})`);

  // Template 2: Feature Grid 3 Columns
  const featureTemplate = await prisma.blockTemplateV2.create({
    data: {
      name: 'Lưới 3 Tính Năng',
      description: 'Section hiển thị 3 tính năng chính với icon và mô tả',
      category: 'template',
      tags: ['features', 'grid', 'services'],
      published: true,
      downloads: 0,
      authorId: adminUser.id,
      block: {
        type: 'html',
        content: {
          html: `
<div class="w-full bg-white py-16 px-4">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-900">
      Dịch vụ của chúng tôi
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Feature 1 -->
      <div class="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-blue transition-all text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-900">Nhanh chóng</h3>
        <p class="text-gray-600">
          Giải pháp tức thì cho mọi nhu cầu của bạn
        </p>
      </div>

      <!-- Feature 2 -->
      <div class="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-blue transition-all text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-900">Đáng tin cậy</h3>
        <p class="text-gray-600">
          Chất lượng được đảm bảo 100%
        </p>
      </div>

      <!-- Feature 3 -->
      <div class="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-blue transition-all text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-900">Linh hoạt</h3>
        <p class="text-gray-600">
          Tùy chỉnh theo nhu cầu riêng
        </p>
      </div>
    </div>
  </div>
</div>
          `.trim()
        },
        styles: {
          container: 'w-full bg-white'
        }
      },
    },
  });
  console.log(`✅ Created: ${featureTemplate.name} (${featureTemplate.id})`);

  // Template 3: CTA Section
  const ctaTemplate = await prisma.blockTemplateV2.create({
    data: {
      name: 'Call-to-Action Section',
      description: 'Section kêu gọi hành động với background gradient',
      category: 'template',
      tags: ['cta', 'action', 'conversion'],
      published: true,
      downloads: 0,
      authorId: adminUser.id,
      block: {
        type: 'html',
        content: {
          html: `
<div class="w-full bg-gradient-to-br from-brand-orange to-orange-600 py-16 px-4">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-4xl font-bold text-white mb-4">
      Sẵn sàng bắt đầu?
    </h2>
    <p class="text-xl text-white/90 mb-8">
      Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button class="bg-white text-brand-orange px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
        Bắt đầu miễn phí
      </button>
      <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
        Tìm hiểu thêm
      </button>
    </div>
  </div>
</div>
          `.trim()
        },
        styles: {
          container: 'w-full'
        }
      },
    },
  });
  console.log(`✅ Created: ${ctaTemplate.name} (${ctaTemplate.id})`);

  // Template 4: Testimonial Card
  const testimonialTemplate = await prisma.blockTemplateV2.create({
    data: {
      name: 'Testimonial Card',
      description: 'Card hiển thị lời chứng thực từ khách hàng',
      category: 'element',
      tags: ['testimonial', 'review', 'customer'],
      published: true,
      downloads: 0,
      authorId: adminUser.id,
      block: {
        type: 'html',
        content: {
          html: `
<div class="w-full bg-gray-50 py-16 px-4">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white p-8 rounded-2xl shadow-lg">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
          N
        </div>
        <div>
          <h3 class="font-bold text-lg text-gray-900">Nguyễn Văn A</h3>
          <p class="text-gray-500">CEO, ABC Company</p>
        </div>
      </div>
      <div class="flex gap-1 mb-4">
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>
      <p class="text-gray-700 leading-relaxed italic">
        "Dịch vụ tuyệt vời! Đội ngũ chuyên nghiệp và nhiệt tình. 
        Tôi rất hài lòng với kết quả và chắc chắn sẽ tiếp tục sử dụng."
      </p>
    </div>
  </div>
</div>
          `.trim()
        },
        styles: {
          container: 'w-full bg-gray-50'
        }
      },
    },
  });
  console.log(`✅ Created: ${testimonialTemplate.name} (${testimonialTemplate.id})`);

  // Template 5: Contact Form
  const contactTemplate = await prisma.blockTemplateV2.create({
    data: {
      name: 'Form Liên Hệ',
      description: 'Form liên hệ đơn giản với các trường cơ bản',
      category: 'element',
      tags: ['form', 'contact', 'input'],
      published: true,
      downloads: 0,
      authorId: adminUser.id,
      block: {
        type: 'html',
        content: {
          html: `
<div class="w-full bg-white py-16 px-4">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-8 text-gray-900">
      Liên hệ với chúng tôi
    </h2>
    <form class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Họ và tên
        </label>
        <input 
          type="text" 
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors"
          placeholder="Nhập họ tên của bạn"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input 
          type="email" 
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tin nhắn
        </label>
        <textarea 
          rows="4"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors resize-none"
          placeholder="Nội dung tin nhắn..."
        ></textarea>
      </div>
      <button 
        type="submit"
        class="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
      >
        Gửi tin nhắn
      </button>
    </form>
  </div>
</div>
          `.trim()
        },
        styles: {
          container: 'w-full bg-white'
        }
      },
    },
  });
  console.log(`✅ Created: ${contactTemplate.name} (${contactTemplate.id})`);

  console.log(`\n🎉 Seeding complete! Created 5 new templates.`);
  console.log(`\nTotal templates in BlockTemplateV2:`);
  
  const count = await prisma.blockTemplateV2.count({
    where: { published: true }
  });
  
  console.log(`   Published: ${count}`);
  console.log(`\n✅ BlockSidebar should now show ${count} templates!`);

  await prisma.$disconnect();
}

main().catch(console.error);
