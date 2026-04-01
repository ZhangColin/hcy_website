"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const platforms = [
  {
    title: "AI党建智能平台",
    highlights: ["90秒出报告", "零幻觉", "全流程闭环"],
    desc: "AI交互+综合管理双轮驱动，六大核心功能覆盖党务全流程",
    color: "#D4A843",
  },
  {
    title: "AI教育智能平台",
    highlights: ["个性化学习", "智能评估", "教学辅助"],
    desc: "AI模型集成+全学段教研员系统+多模态创作中心",
    color: "#1A3C8A",
  },
  {
    title: "AI政务智能平台",
    highlights: ["一站式服务", "智能审批", "数据洞察"],
    desc: "智慧城市、数据治理、政策智能匹配、政务文稿自动化",
    color: "#00796B",
  },
  {
    title: "AI企业管理平台",
    highlights: ["流程优化", "智能决策", "降本增效"],
    desc: "零代码开发+自动化工作流+数据分析与经营研判",
    color: "#2B6CB0",
  },
];

const thinkTankServices = [
  {
    title: "企业AI战略咨询",
    desc: ["企业AI数字化转型路径规划","AI投资决策咨询","新质生产力战略落地方案","AI组织架构与人才体系设计"],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
    cases: [],
  },
  {
    title: "AI创新空间规划咨询",
    desc: ["AI实验室空间规划与装修设计方案","功能分区设计与设备造型方案","实验室分级配置"],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
    cases: ["北京开放大学", "四川绵阳南山中学"],
  },
  {
    title: "白名单赛事辅导咨询",
    desc: ["赛前辅导培训","赛事全程陪护与资源对接","名校直通车计划"],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 0 1-2.4.936m2.4-.936a6 6 0 0 1-2.4.936m-3.84 0a6.003 6.003 0 0 1-2.4-.936m2.4.936v3.086a7.454 7.454 0 0 1-.982 3.172M12 14.25a7.454 7.454 0 0 0 .982-3.172" />
      </svg>
    ),
    cases: [],
  },
];

const advantages = [
  { title: "国企信用背书", desc: ["政府/国企客户信任基础","党建类项目合规无忧","政府采购直接参与资格"] },
  { title: "技术底座自研", desc: ["AI智研云平台自主研发","按需定制，灵活部署","区级入库，官方认可"] },
  { title: "全链条协同", desc: ["咨询出方案，平台做落地","规划、建设、运营一体化","平台开发与咨询双向联动"] },
  { title: "实战案例沉淀", desc: ["130+所服务院校经验","文化和旅游部标杆案例","多个机关单位党建合作"] },
  { title: "复合型专家团队", desc: ["既懂技术又懂政策","既懂教育又懂产业","业内知名专家资源"] },
];

export default function SmartServicesPage() {
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch('/api/buttons/smart-services')
      .then(res => res.json())
      .then(setButtons)
      .catch(() => setButtons({ hero: [], cta: [] }));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
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
            <Link href="/ecosystem" className="text-gray-400 hover:text-[#1A3C8A] transition-colors">产融生态矩阵</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">智创专项服务</span>
          </nav>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2557] via-[#1A3C8A] to-[#2B6CB0] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-[#00796B] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              产融生态矩阵 · 专项服务
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              智创专项服务
              <span className="text-[#D4A843]"> · 专项赋能</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 mb-8 leading-relaxed">
              数智平台工坊 + 卓识战略智库
            </p>
            <div className="flex flex-wrap gap-4">
              {buttons.hero?.map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  target={btn.openNewTab ? '_blank' : undefined}
                  rel={btn.openNewTab ? 'noopener noreferrer' : undefined}
                  className={i === 0
                    ? "inline-flex items-center px-8 py-3 bg-[#D4A843] hover:bg-[#c49a38] text-white font-semibold rounded-lg transition-colors shadow-lg"
                    : "inline-flex items-center px-8 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                  }
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview: 双轮赋能 */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">双轮赋能</h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">数智平台工坊提供技术底座，卓识战略智库提供战略指引，双轮驱动赋能客户数智化转型</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-[#1A3C8A]/10 text-[#1A3C8A] flex items-center justify-center mb-6 group-hover:bg-[#1A3C8A] group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">数智平台工坊</h3>
              <p className="text-gray-600 leading-relaxed">面向政企客户提供AI智能平台产品，涵盖党建、教育、政务、企业管理四大领域，支持SaaS及私有化灵活部署。</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-[#D4A843]/10 text-[#D4A843] flex items-center justify-center mb-6 group-hover:bg-[#D4A843] group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">卓识战略智库</h3>
              <p className="text-gray-600 leading-relaxed">汇聚AI+行业复合型专家团队，为企业与机构提供AI战略咨询、创新空间规划及赛事辅导等高端咨询服务。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Platform Workshop */}
      <section id="platforms" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">数智平台工坊</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">四大AI智能平台产品，覆盖核心行业场景</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((p) => (
              <div key={p.title} className="bg-[#F5F7FA] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.highlights.map((h) => (
                    <span key={h} className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: p.color }}>
                      {h}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A3C8A]/10 rounded-full">
              <svg className="w-5 h-5 text-[#1A3C8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
              </svg>
              <span className="text-[#1A3C8A] font-medium text-sm">支持SaaS及私有化灵活部署</span>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Think Tank */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3">卓识战略智库</h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">高端AI咨询服务，助力战略决策与创新落地</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {thinkTankServices.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-xl bg-[#D4A843]/10 text-[#D4A843] flex items-center justify-center mb-5 group-hover:bg-[#D4A843] group-hover:text-white transition-colors">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">{s.desc.map((x) => (
                        <span style={{ display: 'block' }}>{x}</span>
                      ))}</p>
                
                {s.cases.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">案例</p>
                    <div className="flex flex-wrap gap-2">
                      {s.cases.map((c) => (
                        <span key={c} className="px-3 py-1 bg-[#D4A843]/10 text-[#D4A843] rounded-full text-xs font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Five Core Advantages */}
      <section className="py-20 bg-gradient-to-r from-[#0f2557] via-[#1A3C8A] to-[#2B6CB0]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">五大核心优势</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {advantages.map((a, i) => (
              <div key={a.title} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-extrabold text-[#D4A843] mb-3">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                {a.desc.map((x, l) => (<p className="text-white/70 text-sm">{x}</p>))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">开启数智化转型之旅</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">无论是平台部署还是战略咨询，我们为您提供专业的解决方案</p>
          <div className="flex flex-wrap justify-center gap-4">
            {buttons.cta?.map((btn, i) => (
              <button
                key={i}
                onClick={() => {
                  if (btn.openNewTab) {
                    window.open(btn.href, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = btn.href;
                  }
                }}
                className={i === 0
                  ? "px-10 py-4 bg-[#1A3C8A] hover:bg-[#0f2557] text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                  : "px-10 py-4 bg-white hover:bg-gray-50 text-[#1A3C8A] font-bold rounded-lg text-lg transition-colors border-2 border-[#1A3C8A]"
                }
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
