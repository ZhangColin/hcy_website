"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const services = [

  {
    title: "OPC生态",
    subtitle: "规模化交付",
    desc: "以真实订单激活超级个体网络，六大订单类型，L1/L2/L3三级养成计划，培训即就业。",
    href: "/ecosystem/opc",
    color: "#00796B",
  },
  {
    title: "生态产品联盟",
    subtitle: "生态闭环",
    desc: "海创元作为总集成商，联合海亮科技、蜜蜂家校、洋葱学园、宇视科技等品牌，一站式补全AI教育生态。",
    href: "/services/ecosystem-alliance",
    color: "#1565C0",
  },
  {
    title: "智创专项服务",
    subtitle: "专项赋能",
    desc: "数智平台工坊（AI党建/教育/政务/企管）+ 卓识战略智库，国企信用背书，全链条协同。",
    href: "/ecosystem/smart-services",
    color: "#00695C",
  },
  {
    title: "不良资产盘活",
    subtitle: "空间载体",
    desc: "三角稳定架构模式：资产持有端+投资建设端+运营管理端，AI轻资产运营赋能模式。",
    href: "/ecosystem/asset-revitalization",
    color: "#004D40",
  },
];

export default function EcosystemPage() {
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch('/api/buttons/ecosystem')
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
            <Link href="/" className="hover:text-[#00796B] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#00796B] font-semibold">产融生态矩阵</span>
          </nav>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-white py-20" style={{ background: "linear-gradient(135deg, #004D40 0%, #00796B 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">产融生态矩阵</h1>
          <p className="text-xl text-green-100 max-w-2xl mb-8">
            以政企AI赋能培训、OPC生态、智创专项服务、不良资产盘活四大业务线，构建产业融合生态，实现规模化交付。
          </p>
          {buttons.hero && buttons.hero.length > 0 && (
            <div className="flex flex-wrap gap-4">
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
                    <h2 className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.title}</h2>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-[#00796B] transition-colors mt-1 shrink-0"
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
