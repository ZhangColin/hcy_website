"use client";

import Link from "next/link";

const modules = [
  {
    num: "01",
    title: "公文写作",
    desc: "AI辅助公文起草、审核与优化，效率提升数倍",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "汇报视觉设计",
    desc: "AI驱动专业PPT与可视化汇报材料制作",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "视频品牌传播",
    desc: "AI视频创作与品牌内容传播策略",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "零代码工具搭建",
    desc: "无需编程，AI辅助快速搭建业务工具",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "运营自动化",
    desc: "AI工作流与自动化运营体系搭建",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "综合实战路演",
    desc: "综合运用AI工具完成实战项目路演",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 1-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "60%", label: "公文效率提升" },
  { value: "50%", label: "外包成本降低" },
  { value: "3-5倍", label: "内容产出提速" },
];

const outcomes = [
  { title: "企业宣传视频", desc: "AI驱动的品牌宣传短视频制作", icon: "🎬" },
  { title: "工作汇报PPT", desc: "专业级AI辅助汇报材料生成", icon: "📊" },
  { title: "数字管理工具", desc: "零代码搭建的业务管理应用", icon: "🛠" },
  { title: "AI工作方案", desc: "完整的AI应用落地实施方案", icon: "📋" },
];

const targets = [
  { title: "政府/事业单位", desc: "提升行政效能与公共服务智能化" },
  { title: "文旅行业", desc: "数智化赋能文旅产业升级" },
  { title: "教育主管部门", desc: "AI教育管理与教学创新" },
  { title: "企业高管", desc: "AI战略思维与决策能力提升" },
  { title: "各行业从业者", desc: "AI工具实操与效率提升" },
  { title: "大中型民企管理干部", desc: "AI赋能企业管理数字化转型" },
];

const cases = [
  {
    title: "文旅部2026高级研修项目",
    desc: "受文化和旅游部委托，为全国文旅系统高级管理人员提供AI数智化培训，涵盖智慧文旅、数字营销与AI内容创作等前沿领域。",
  },
  {
    title: "湖南省旅游数智人才项目",
    desc: "面向湖南省旅游行业骨干人才，开展AI赋能旅游产业数智化转型专项培训，培养具备AI思维的新型文旅人才。",
  },
];

export default function EnterpriseTrainingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
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
            <Link href="/ecosystem" className="text-gray-400 hover:text-[#00796B] transition-colors">产融生态矩阵</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#00796B] font-semibold">政企AI赋能培训</span>
          </nav>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004d40] via-[#00796B] to-[#009688] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              产融生态矩阵 · 政企培训
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              政企AI赋能培训
              <span className="text-[#D4A843]"> · 跨界复制</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 mb-8 leading-relaxed">
              AI赋能千行百业 · 数智人才实战锻造
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#cta" className="inline-flex items-center px-8 py-3 bg-[#D4A843] hover:bg-[#c49a38] text-white font-semibold rounded-lg transition-colors shadow-lg">
                定制培训方案
              </a>
              <a href="#courses" className="inline-flex items-center px-8 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm border border-white/20">
                了解课程体系
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Course System */}
      <section id="courses" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">课程体系</h2>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#00796B]/10 rounded-full">
              <span className="text-[#00796B] font-semibold text-lg">6课时</span>
              <span className="w-1 h-1 bg-[#00796B] rounded-full" />
              <span className="text-gray-600">约12学时 · 理论+实操全覆盖</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div
                key={m.num}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#00796B]/10 text-[#00796B] flex items-center justify-center group-hover:bg-[#00796B] group-hover:text-white transition-colors">
                    {m.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#00796B]/60 tracking-wider">MODULE {m.num}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{m.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Performance Data */}
      <section className="py-20 bg-gradient-to-r from-[#004d40] via-[#00796B] to-[#009688]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">核心效能数据</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/15">
                <div className="text-5xl md:text-6xl font-extrabold text-[#D4A843] mb-3">{s.value}</div>
                <div className="text-lg text-white/90 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Outcomes */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">四大实战成果交付</h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">每位学员将在培训中完成以下四类实战项目，带走可直接应用的成果</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {outcomes.map((o) => (
              <div key={o.title} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="text-4xl mb-4">{o.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{o.title}</h3>
                <p className="text-gray-500 text-sm">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Target Matrix */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">服务对象矩阵</h2>
          <p className="text-center text-gray-500 mb-14">覆盖政府、企业、教育等多领域培训需求</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {targets.map((t) => (
              <div key={t.title} className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#F5F7FA] to-white border border-gray-100 hover:border-[#00796B]/30 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00796B] opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-gray-500 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications & Cases */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">资质认证与标杆案例</h2>
          <p className="text-center text-gray-500 mb-14">权威认证背书，实战案例验证培训实力</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A843]/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D4A843]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{c.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-gradient-to-br from-[#004d40] via-[#00796B] to-[#009688] text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">开启AI赋能培训之旅</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">根据您的行业特点与团队需求，定制专属AI培训方案</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-[#D4A843] hover:bg-[#c49a38] text-white font-bold rounded-lg text-lg transition-colors shadow-lg">
              定制企业培训方案
            </button>
            <button className="px-10 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-lg text-lg transition-colors border border-white/25 backdrop-blur-sm">
              咨询合作
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
