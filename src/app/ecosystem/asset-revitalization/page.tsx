"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const triangleNodes = [
  {
    title: "资产持有端",
    desc: "不良资产持有方，包括银行、AMC、地方平台等，提供资产包与项目资源",
    color: "#00796B",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
  },
  {
    title: "投资建设端",
    desc: "引入社会资本与产业投资方，提供资金支持与建设改造能力",
    color: "#1A3C8A",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "运营管理端",
    desc: "专业运营团队负责资产盘活后的持续运营、招商引资与价值提升",
    color: "#D4A843",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

const keyGrips = [
  {
    stage: "前端",
    title: "找钱有术",
    desc: "精准对接金融机构与社会资本，构建多元化融资渠道体系，通过结构化金融工具盘活沉睡资产价值",
    color: "#1A3C8A",
    items: ["政策性资金对接", "产业基金引入", "资产证券化设计", "银企对接撮合"],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    stage: "中端",
    title: "流量有底",
    desc: "依托数字化营销与产业资源整合，为盘活资产导入稳定客流与商流，确保项目运营有坚实的流量基础",
    color: "#00796B",
    items: ["数字化营销获客", "产业资源导入", "区域流量聚合", "品牌IP打造"],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    stage: "后端",
    title: "转化有数",
    desc: "通过数据驱动的精细化运营，实现资产价值的可量化转化，用数据说话，让每一步盘活都有据可依",
    color: "#D4A843",
    items: ["资产价值评估模型", "运营数据看板", "投资回报测算", "风控预警体系"],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
  },
];

const aiCapabilities = [
  {
    title: "智能资产评估",
    desc: "AI驱动的资产价值评估系统，快速精准定价，降低人工成本与误判风险",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: "数字化招商运营",
    desc: "轻资产模式下，AI赋能线上招商、智能匹配租户与业态，提升招商效率与运营坪效",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    ),
  },
  {
    title: "智能风控监测",
    desc: "实时监控资产运营数据与市场变化，AI预警潜在风险，保障投资安全与资产增值",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "自动化报告生成",
    desc: "一键生成资产盘活方案报告、运营分析报告与投资回报报告，大幅提升决策效率",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
];

export default function AssetRevitalizationPage() {
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch('/api/buttons/asset-revitalization')
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
            <Link href="/" className="hover:text-[#D4A843] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/ecosystem" className="text-gray-400 hover:text-[#D4A843] transition-colors">产融生态矩阵</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#D4A843] font-semibold">不良资产盘活</span>
          </nav>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#D4A843] via-[#B8860B] to-[#8B6914] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#1A3C8A] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              产融生态矩阵 · 不良资产盘活
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              不良资产盘活
              <span className="text-white"> · 价值重塑</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 mb-8 leading-relaxed">
              三角稳定架构驱动，AI轻资产运营赋能，让沉睡资产焕发新生
            </p>
            <div className="flex flex-wrap gap-4">
              {buttons.hero?.map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  target={btn.openNewTab ? '_blank' : undefined}
                  rel={btn.openNewTab ? 'noopener noreferrer' : undefined}
                  className={i === 0
                    ? "inline-flex items-center px-8 py-3 bg-white hover:bg-gray-100 text-[#8B6914] font-semibold rounded-lg transition-colors shadow-lg"
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

      {/* Triangle Stable Architecture */}
      <section id="triangle" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">三角稳定架构</h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">资产持有端、投资建设端、运营管理端三方协同，构建稳固的资产盘活生态体系</p>

          {/* Triangle Diagram */}
          <div className="relative max-w-3xl mx-auto mb-16">
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-white shadow-lg border-2 border-[#00796B]/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-bold text-[#00796B]">三角</div>
                  <div className="text-sm font-bold text-[#00796B]">稳定架构</div>
                </div>
              </div>
            </div>

            {/* SVG triangle lines */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 600 400" fill="none" preserveAspectRatio="xMidYMid meet">
              <line x1="300" y1="60" x2="80" y2="340" stroke="#00796B" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
              <line x1="300" y1="60" x2="520" y2="340" stroke="#1A3C8A" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
              <line x1="80" y1="340" x2="520" y2="340" stroke="#D4A843" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
            </svg>

            {/* Triangle nodes */}
            <div className="relative grid grid-cols-2 gap-8 pt-4 pb-4">
              {/* Top node */}
              <div className="col-span-2 flex justify-center">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group max-w-xs w-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#00796B]/10 text-[#00796B] flex items-center justify-center mb-4 mx-auto group-hover:bg-[#00796B] group-hover:text-white transition-colors">
                    {triangleNodes[0].icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{triangleNodes[0].title}</h3>
                  <p className="text-gray-500 text-sm">{triangleNodes[0].desc}</p>
                </div>
              </div>
              {/* Bottom left */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group max-w-xs w-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#1A3C8A]/10 text-[#1A3C8A] flex items-center justify-center mb-4 mx-auto group-hover:bg-[#1A3C8A] group-hover:text-white transition-colors">
                    {triangleNodes[1].icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{triangleNodes[1].title}</h3>
                  <p className="text-gray-500 text-sm">{triangleNodes[1].desc}</p>
                </div>
              </div>
              {/* Bottom right */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group max-w-xs w-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#D4A843]/10 text-[#D4A843] flex items-center justify-center mb-4 mx-auto group-hover:bg-[#D4A843] group-hover:text-white transition-colors">
                    {triangleNodes[2].icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{triangleNodes[2].title}</h3>
                  <p className="text-gray-500 text-sm">{triangleNodes[2].desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture advantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "风险分散", desc: "三方共担风险，单一节点失败不影响整体运转" },
              { label: "资源互补", desc: "资产、资金、运营三大核心资源形成闭环" },
              { label: "利益共享", desc: "收益按贡献分配，激发各方最大动力" },
            ].map((a) => (
              <div key={a.label} className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00796B]/10 text-[#00796B] mb-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{a.label}</h4>
                <p className="text-gray-500 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Key Grips */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">三个关键抓手</h2>
          <p className="text-center text-gray-500 mb-14">前端找钱、中端引流、后端转化，全链条闭环驱动资产价值释放</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
            {keyGrips.map((g, i) => (
              <div key={g.title} className="relative flex flex-col">
                {/* Arrow between grips */}
                {i < keyGrips.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                )}
                {/* Mobile arrow */}
                {i < keyGrips.length - 1 && (
                  <div className="flex lg:hidden justify-center py-3">
                    <svg className="w-8 h-8 text-gray-300 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                )}
                <div
                  className="flex-1 rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-lg mx-2"
                  style={{ borderColor: g.color }}
                >
                  <div className="text-center mb-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white mb-3"
                      style={{ backgroundColor: g.color }}
                    >
                      {g.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-400 mb-1">{g.stage}</div>
                    <h3 className="text-2xl font-bold text-gray-900">{g.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm mb-6 text-center">{g.desc}</p>
                  <ul className="space-y-3">
                    {g.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: g.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Light-Asset Operation Empowerment */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">AI轻资产运营赋能</h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">以AI技术替代传统重资产运营模式，降低运营成本，提升盘活效率与资产增值空间</p>

          {/* Mode explanation */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">轻资产运营模式</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  通过AI技术深度介入资产盘活全流程，以数字化工具替代传统人力密集型运营，实现低投入、高产出的轻资产运营模式。从资产评估、招商引资到持续运营，AI全程赋能，大幅降低运营门槛与成本。
                </p>
                <div className="flex flex-wrap gap-3">
                  {["低投入高回报", "数据驱动决策", "智能化运营", "快速复制扩展"].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 bg-[#00796B]/10 text-[#00796B] rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#00796B]">60%</div>
                  <div className="text-sm text-gray-500 mt-1">运营成本降低</div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#1A3C8A]">3倍</div>
                  <div className="text-sm text-gray-500 mt-1">盘活效率提升</div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#D4A843]">90%</div>
                  <div className="text-sm text-gray-500 mt-1">决策准确率</div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#2B6CB0]">7天</div>
                  <div className="text-sm text-gray-500 mt-1">方案生成周期</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiCapabilities.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-xl bg-[#00796B]/10 text-[#00796B] flex items-center justify-center mb-4 group-hover:bg-[#00796B] group-hover:text-white transition-colors">
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-gradient-to-r from-[#004d40] via-[#00796B] to-[#2B6CB0]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">盘活全流程</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "01", label: "资产尽调", desc: "全面摸底资产现状与价值" },
              { step: "02", label: "方案设计", desc: "定制化盘活策略与路径" },
              { step: "03", label: "资金对接", desc: "匹配最优融资方案" },
              { step: "04", label: "改造运营", desc: "资产升级与业态导入" },
              { step: "05", label: "价值兑现", desc: "持续运营实现资产增值" },
            ].map((s) => (
              <div key={s.step} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-extrabold text-[#D4A843] mb-3">{s.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.label}</h3>
                <p className="text-white/70 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">让沉睡资产焕发新生</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">三角稳定架构 + AI轻资产运营，为您提供专业的不良资产盘活解决方案</p>
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
                  ? "px-10 py-4 bg-[#00796B] hover:bg-[#004d40] text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                  : "px-10 py-4 bg-white hover:bg-gray-50 text-[#00796B] font-bold rounded-lg text-lg transition-colors border-2 border-[#00796B]"
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
