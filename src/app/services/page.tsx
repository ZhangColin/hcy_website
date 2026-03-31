"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const services = [
  {
    title: "AI课程入校",
    subtitle: "核心引擎",
    desc: "1+N综合解决方案，覆盖小/初/高全学段，5年课堂实践打磨，累计服务130+所院校。",
    href: "/services/ai-curriculum",
    color: "#1565C0",
  },
  {
    title: "AI师资培训与等级认证",
    subtitle: "配套刚需",
    desc: "双轨培训体系+工信部国家级等级认证，打造培训—认证—持证上岗闭环。",
    href: "/services/teacher-training",
    color: "#1A3C8A",
  },
  {
    title: "政企AI赋能培训",
    subtitle: "跨界复制",
    desc: "AI赋能千行百业，数智人才实战锻造。公文效率提升60%，外包成本降低50%，内容产出提速3-5倍。",
    href: "/ecosystem/enterprise-training",
    color: "#00796B",
  },
  {
    title: "AI研学",
    subtitle: "场景延伸",
    desc: "多层次、多场景研学服务体系，覆盖学校、企业、高层次领导力及低龄群体。",
    href: "/services/ai-research-study",
    color: "#2B6CB0",
  },
];

export default function ServicesPage() {
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch('/api/buttons/services')
      .then(res => res.json())
      .then(setButtons)
      .catch(() => setButtons({ hero: [], cta: [] }));
  }, []);

  return (
    <main>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1A3C8A] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">智教服务集群</span>
          </nav>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">智教服务集群</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            以AI课程入校为核心引擎，融合师资培训、AI研学与生态产品联盟，构建完整的智慧教育服务体系。
          </p>
          {buttons.hero && buttons.hero.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
              {buttons.hero.map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  target={btn.openNewTab ? '_blank' : undefined}
                  rel={btn.openNewTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center px-6 py-3 bg-[#D4A843] text-white font-medium rounded-lg hover:bg-[#c49a3a] transition-colors"
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 hover:-translate-y-1"
                style={{ borderColor: s.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full text-white mb-3 inline-block"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.subtitle}
                    </span>
                    <h2 className="text-2xl font-bold text-[#1A3C8A] mt-2">{s.title}</h2>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-[#1A3C8A] transition-colors mt-1 shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-[#666] leading-relaxed">{s.desc}</p>
                <span className="mt-4 inline-block text-sm font-medium" style={{ color: s.color }}>
                  了解更多 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
