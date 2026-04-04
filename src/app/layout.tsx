import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  title: '海创元AI教育 - AI教育全链赋能生态运营商 | 海淀国投集团',
  description:
    '北京海创元人工智能教育科技有限公司，海淀国投集团全资企业。提供AI课程入校、AI师资培训与认证、AI研学、政企AI赋能培训、OPC生态等八大业务线服务。',
  keywords:
    '海创元,AI教育,人工智能教育,AI课程入校,师资培训,AI研学,政企培训,OPC生态,海淀国投',
  icons: {
    icon: '/logo-light-32.png',
  },
  verification: {
    google: process.env.GOOGLE_VERIFY_CODE,
  },
  openGraph: {
    siteName: '海创元AI教育',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'baidu-site-verification': process.env.BAIDU_VERIFY_CODE,
  },
};

const organizationData = {
  name: '北京海创元人工智能教育科技有限公司',
  alternateName: '海创元AI教育',
  url: 'https://aieducenter.com',
  logo: 'https://aieducenter.com/logo.png',
  description: 'AI教育全链赋能生态运营商',
  parentOrganization: {
    '@type': 'Organization',
    name: '海淀国投集团',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: '北京',
    addressCountry: 'CN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+86-xxx-xxxx-xxxx',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <JsonLd type="Organization" data={organizationData} />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
