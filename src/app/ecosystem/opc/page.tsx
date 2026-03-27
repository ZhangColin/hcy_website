"use client";

import Link from "next/link";

const orderTypes = [
  {
    title: "AI教育课程开发",
    desc: "定制化AI教育课程内容设计与开发",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    title: "政企培训",
    desc: "面向政府与企业的AI技能培训服务",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    title: "研学项目",
    desc: "AI主题研学旅行与实践体验项目",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    title: "党建应用",
    desc: "AI赋能智慧党建平台与活动策划",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
      </svg>
    ),
  },
  {
    title: "新媒体",
    desc: "AI驱动的新媒体内容运营与推广",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "AI工具定制",
    desc: "企业级AI工具与解决方案定制开发",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

const tiers = [
  {
    level: "L1",
    name: "基础版",
    hours: "8学时",
    price: "1,200元",
    color: "#2B6CB0",
    features: ["AI基础认知与工具使用", "单一场景实操训练", "基础项目产出能力"],
  },
  {
    level: "L2",
    name: "进阶版",
    hours: "20学时",
    price: "3,800元",
    color: "#00796B",
    features: ["多场景AI应用组合", "客户需求分析方法论", "独立项目交付能力", "OPC接单实战演练"],
  },
  {
    level: "L3",
    name: "高级版",
    hours: "30学时",
    price: "6,800元",
    color: "#D4A843",
    features: ["复杂项目全链条管理", "团队协作与项目调度", "高价值客户服务能力", "导师级指导资格", "优先接单权益"],
  },
];

const capabilityLevels = [
  { level: "C级", range: "500 - 3,000元", desc: "基础执行任务", color: "#2B6CB0", width: "100%" },
  { level: "B级", range: "3,000 - 20,000元", desc: "独立项目交付", color: "#00796B", width: "75%" },
  { level: "A级", range: "2万 - 20万元", desc: "复杂方案策划", color: "#D4A843", width: "50%" },
];

const barriers = [
  {
    title: "国企信用背书",
    desc: "依托国有企业资质与品牌背书，建立客户信任基础",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "已有业务版图",
    desc: "100+私域客户资源积累，成熟的市场网络与客户关系",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 1 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
      </svg>
    ),
  },
  {
    title: "AI教育全链条能力",
    desc: "从课程研发到交付运营，覆盖AI教育全生命周期",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
];

export default function OPCPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1A3C8A] transition-colors">首页</Link>
            <span>/</span>
            <span className="text-gray-400">产融生态矩阵</span>
            <span>/</span>
            <span className="text-[#1A3C8A] font-medium">OPC生态</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2557] via-[#1A3C8A] to-[#2B6CB0] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-[#D4A843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              产融生态矩阵 · OPC生态
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              OPC生态
              <span className="text-[#D4A843]"> · 规模化交付</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 mb-8 leading-relaxed">
              以真实订单激活超级个体网络
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#cta" className="inline-flex items-center px-8 py-3 bg-[#D4A843] hover:bg-[#c49a38] text-white font-semibold rounded-lg transition-colors shadow-lg">
                立即报名
              </a>
              <a href="#training" className="inline-flex items-center px-8 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm border border-white/20">
                了解养成计划
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Trends */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">行业趋势</h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">全国OPC生态建设爆发式增长</p>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">OPC模式全国铺开</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  上海、杭州、深圳等一线城市率先布局OPC生态建设，通过整合AI超级个体资源，实现规模化项目交付。这一模式正在向全国范围内快速扩展，形成覆盖多行业、多场景的服务网络。
                </p>
                <div className="flex flex-wrap gap-3">
                  {["上海", "杭州", "深圳", "北京", "成都", "长沙"].map((city) => (
                    <span key={city} className="px-4 py-1.5 bg-[#1A3C8A]/10 text-[#1A3C8A] rounded-full text-sm font-medium">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#1A3C8A]">100+</div>
                  <div className="text-sm text-gray-500 mt-1">覆盖城市</div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#00796B]">10万+</div>
                  <div className="text-sm text-gray-500 mt-1">超级个体</div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#D4A843]">50+</div>
                  <div className="text-sm text-gray-500 mt-1">行业场景</div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#2B6CB0]">千万级</div>
                  <div className="text-sm text-gray-500 mt-1">订单规模</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">三大竞争壁垒</h2>
          <p className="text-center text-gray-500 mb-14">差异化优势，构建不可复制的生态护城河</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {barriers.map((b, i) => (
              <div key={b.title} className="relative bg-gradient-to-br from-[#F5F7FA] to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="absolute top-6 right-6 text-5xl font-extrabold text-gray-100 group-hover:text-[#1A3C8A]/10 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-14 h-14 rounded-xl bg-[#1A3C8A]/10 text-[#1A3C8A] flex items-center justify-center mb-5 group-hover:bg-[#1A3C8A] group-hover:text-white transition-colors">
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
                <p className="text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Order Types */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">六大订单类型</h2>
          <p className="text-center text-gray-500 mb-14">多元化订单来源，持续稳定的业务增长</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderTypes.map((o) => (
              <div key={o.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-xl bg-[#2B6CB0]/10 text-[#2B6CB0] flex items-center justify-center mb-4 group-hover:bg-[#2B6CB0] group-hover:text-white transition-colors">
                  {o.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{o.title}</h3>
                <p className="text-gray-500 text-sm">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPC Training Plan */}
      <section id="training" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">OPC养成计划</h2>
          <p className="text-center text-gray-500 mb-14">三阶进阶体系，从入门到高手的完整成长路径</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
            {tiers.map((t, i) => (
              <div key={t.level} className="relative flex flex-col">
                {/* Arrow between tiers */}
                {i < tiers.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                )}
                {/* Mobile arrow */}
                {i < tiers.length - 1 && (
                  <div className="flex lg:hidden justify-center py-3">
                    <svg className="w-8 h-8 text-gray-300 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                )}
                <div
                  className="flex-1 rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-lg mx-2"
                  style={{ borderColor: t.color }}
                >
                  <div className="text-center mb-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-extrabold mb-3"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.level}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t.name}</h3>
                    <div className="flex items-center justify-center gap-3 mt-2 text-gray-500">
                      <span>{t.hours}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="font-bold text-lg" style={{ color: t.color }}>{t.price}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: t.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability Levels & Dispatch */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">能力分级与派单体系</h2>
          <p className="text-center text-gray-500 mb-14">能力越强，接单价值越高</p>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-6">
              {[...capabilityLevels].reverse().map((c) => (
                <div key={c.level} className="w-full" style={{ maxWidth: c.width }}>
                  <div
                    className="rounded-2xl p-6 text-white text-center shadow-lg"
                    style={{ backgroundColor: c.color }}
                  >
                    <div className="text-2xl font-extrabold mb-1">{c.level}</div>
                    <div className="text-lg font-semibold mb-1">{c.range}</div>
                    <div className="text-white/80 text-sm">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-[#D4A843] mr-2" />
                层级越高，承接项目单价越高，收益空间越大
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-gradient-to-br from-[#0f2557] via-[#1A3C8A] to-[#2B6CB0] text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">加入OPC生态，开启超级个体之路</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">系统化培养+真实订单驱动，让AI技能转化为可持续收入</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-[#D4A843] hover:bg-[#c49a38] text-white font-bold rounded-lg text-lg transition-colors shadow-lg">
              立即报名OPC养成计划
            </button>
            <button className="px-10 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-lg text-lg transition-colors border border-white/25 backdrop-blur-sm">
              了解接单机会
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
