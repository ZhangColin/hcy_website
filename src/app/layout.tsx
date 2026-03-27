import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "海创元AI教育 - AI教育全链赋能生态运营商",
  description:
    "北京海创元人工智能教育科技有限公司，海淀国投集团全资企业。提供AI课程入校、AI师资培训与认证、AI研学、政企AI赋能培训、OPC生态等八大业务线服务。",
  keywords:
    "海创元,AI教育,人工智能教育,AI课程入校,师资培训,AI研学,政企培训,OPC生态,海淀国投",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
