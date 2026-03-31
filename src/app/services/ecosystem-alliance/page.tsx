"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ───────── animation hook ───────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

/* ───────── section wrapper ───────── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/* ───────── data ───────── */
const ecoPartners = [
  {
    name: "海亮科技",
    scenario: "智慧教学全场景",
    desc: "提供覆盖课前备课、课中互动、课后评测的智慧教学全场景解决方案，深度融合AI技术与教学管理，打造一站式智慧校园平台。",
    color: "#1565C0",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    highlights: ["智慧课堂系统", "校园物联管理", "教学数据中台"],
  },
  {
    name: "蜜蜂家校",
    scenario: "家校互联与AI智能批改",
    desc: "以家校沟通为核心，整合AI智能批改、作业管理、学情分析等功能，实现家校数据互通，构建高效协同的教育生态。",
    color: "#D4A843",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    highlights: ["AI智能批改", "家校沟通平台", "学情分析报告"],
  },
  {
    name: "洋葱学园",
    scenario: "AI课堂系统与动画课程",
    desc: "以趣味动画为载体，通过AI自适应学习引擎为每位学生定制个性化学习路径，覆盖数学、物理、化学等主要学科。",
    color: "#FF6F00",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    highlights: ["AI自适应引擎", "动画微课体系", "个性化学习路径"],
  },
  {
    name: "宇视科技",
    scenario: "AI智慧体育/心理健康/智慧课堂硬件",
    desc: "以AI视觉技术为核心，提供智慧体育运动分析、学生心理健康监测、智慧课堂硬件终端等全方位校园智能化解决方案。",
    color: "#00796B",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    highlights: ["AI智慧体育", "心理健康监测", "智慧课堂硬件"],
  },
];

const valueProps = [
  {
    target: "对学校",
    color: "#1565C0",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    items: [
      "一站式采购，减少多供应商对接成本",
      "整体方案深度适配，避免系统碎片化",
      "统一售后服务体系，响应更及时高效",
      "经过实校验证的成熟产品组合",
    ],
  },
  {
    target: "对海创元",
    color: "#D4A843",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    items: [
      "补全AI教育完整生态，提升整体方案竞争力",
      "扩大市场覆盖面与服务边界",
      "通过生态联盟增强客户黏性与续约率",
      "实现从课程到硬件的全链条服务能力",
    ],
  },
  {
    target: "对代理品牌",
    color: "#00796B",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    items: [
      "借助海创元渠道快速进入教育市场",
      "与1+N完整方案捆绑，提升转化率",
      "共享海创元品牌背书与客户资源",
      "降低独立拓展市场的成本与风险",
    ],
  },
];

/* ───────── page ───────── */
export default function EcosystemAlliancePage() {
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
            <span className="text-[#1A3C8A] font-semibold">生态产品联盟</span>
          </nav>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1565C0] via-[#1A3C8A] to-[#0D2B6B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-[#D4A843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            智教服务集群 · 生态共赢
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            生态产品联盟
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            海创元作为&ldquo;总集成商&rdquo;，以1+N主干+生态代理补全模式，联合行业优质品牌，一站式补全AI教育完整生态
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#cta"
              className="inline-flex items-center px-6 py-3 bg-[#D4A843] text-white font-medium rounded-lg hover:bg-[#c49a3a] transition-colors"
            >
              成为生态合作伙伴
            </a>
            <a
              href="#partners"
              className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/30 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              了解生态品牌
            </a>
          </div>
        </div>
      </section>

      {/* 1+N Model Introduction */}
      <Section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              1+N 联动模式
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              海创元作为总集成商，以自研AI课程为主干（1），联合生态代理品牌（N）补全完整教育场景
            </p>
          </div>

          {/* Model Diagram */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-5 gap-6 items-center">
              {/* Core: 1 */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-[#1A3C8A] to-[#1565C0] rounded-2xl p-8 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2">1</div>
                  <h3 className="text-xl font-bold mb-2">主干：海创元</h3>
                  <p className="text-white/70 text-sm">
                    自研K12 AI课程体系 + 师资培训 + 等级认证 + 智研云平台
                  </p>
                  <div className="mt-4 inline-block bg-[#D4A843] text-white text-xs font-bold px-3 py-1 rounded-full">
                    总集成商
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <svg className="w-12 h-12 text-[#D4A843]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex md:hidden items-center justify-center py-2">
                <svg className="w-10 h-10 text-[#D4A843] rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Eco: N */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-[#F5F7FA] to-white rounded-2xl p-8 border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-[#1565C0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#1565C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-[#1A3C8A] mb-2">N</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">生态代理品牌</h3>
                  <p className="text-gray-500 text-sm">
                    智慧教学 + 家校互联 + 动画课程 + 智慧硬件
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {ecoPartners.map((p) => (
                      <span
                        key={p.name}
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${p.color}15`,
                          color: p.color,
                        }}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom description */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-10 h-10 bg-[#1565C0]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#1565C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">统一入口</h4>
                  <p className="text-gray-500 text-xs">学校只需对接海创元一家即可获得完整方案</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-[#D4A843]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#D4A843]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">深度适配</h4>
                  <p className="text-gray-500 text-xs">生态产品与自研体系无缝融合，拒绝拼凑式方案</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-[#00796B]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#00796B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">统一服务</h4>
                  <p className="text-gray-500 text-xs">一个售后窗口，保障全生态产品运维质量</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Four Eco Partners */}
      <Section id="partners" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              四大生态代理品牌
            </h2>
            <p className="text-gray-500 text-lg">行业优质伙伴，共同构建AI教育完整生态</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {ecoPartners.map((partner) => (
              <div
                key={partner.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className="p-6"
                  style={{
                    background: `linear-gradient(135deg, ${partner.color}, ${partner.color}CC)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={partner.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                      <p className="text-white/70 text-sm">{partner.scenario}</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {partner.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {partner.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: `${partner.color}10`,
                          color: partner.color,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Value Proposition */}
      <Section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              各方价值说明
            </h2>
            <p className="text-gray-500 text-lg">生态联盟为各参与方创造差异化价值</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((vp) => (
              <div
                key={vp.target}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${vp.color}15` }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: vp.color }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={vp.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{vp.target}</h3>
                <ul className="space-y-3">
                  {vp.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: vp.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Eco Stats */}
      <Section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#1565C0] to-[#1A3C8A] rounded-2xl p-10 md:p-14">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  4<span className="text-[#D4A843]">+</span>
                </div>
                <p className="text-white/70 text-sm">生态代理品牌</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  1+N
                </div>
                <p className="text-white/70 text-sm">总集成商模式</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  100<span className="text-[#D4A843]">%</span>
                </div>
                <p className="text-white/70 text-sm">场景覆盖率</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  1<span className="text-[#D4A843]">站</span>
                </div>
                <p className="text-white/70 text-sm">一站式服务入口</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section id="cta" className="py-16 md:py-24 bg-gradient-to-br from-[#1565C0] via-[#1A3C8A] to-[#0D2B6B] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            成为生态合作伙伴
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            加入海创元生态产品联盟，共享渠道资源与品牌背书，携手打造AI教育完整生态
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#D4A843] text-white font-semibold rounded-xl hover:bg-[#c49a3a] transition-colors">
              成为生态合作伙伴
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#1A3C8A] font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              了解合作详情
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
