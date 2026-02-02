"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactPageData {
  id: string;
  title: string;
  content: string;
  blocks?: any;
  metaTitle?: string;
  metaDescription?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch contact page from database
    const fetchContactPage = async () => {
      try {
        const res = await fetch('/api/pages?published=true');
        const data = await res.json();
        const pages = Array.isArray(data.data) ? data.data : data.data?.data || [];
        const contactPage = pages.find((p: any) => p.slug === 'lien-he');
        if (contactPage) {
          setPageData(contactPage);
        }
      } catch (error) {
        console.error('Error fetching contact page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactPage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const defaultTitle = pageData?.title || "Liên hệ với chúng tôi";
  const defaultDescription = "Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-linear-to-b from-primary/5 to-background py-12 sm:py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {defaultTitle}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {defaultDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4 flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Địa chỉ</p>
                        <p className="text-sm text-muted-foreground">
                          123 Đường ABC, Quận 1<br />
                          TP. Hồ Chí Minh
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Điện thoại</p>
                        <a
                          href="tel:1900xxxx"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          1900 xxxx
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Email</p>
                        <a
                          href="mailto:contact@innerbright.vn"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          contact@innerbright.vn
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Giờ làm việc</p>
                        <p className="text-sm text-muted-foreground">
                          Thứ 2 - Chủ nhật<br />
                          8:00 - 20:00
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Gửi tin nhắn</CardTitle>
                  <CardDescription>
                    Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm font-medium text-primary">
                        ✓ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Ví dụ: email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ví dụ: 0912 345 678"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tin nhắn *</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Viết tin nhắn của bạn..."
                        required
                        rows={6}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Page Content from Database */}
          {pageData?.content && (
            <div className="mt-12 max-w-3xl mx-auto prose prose-sm sm:prose dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{ __html: pageData.content }}
                className="space-y-4"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
