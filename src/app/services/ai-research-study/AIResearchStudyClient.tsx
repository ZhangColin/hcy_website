"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const serviceTabs = [
  {
    id: "school",
    label: "学校定制化服务",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    content: {
      title: "学校定制化AI研学服务",
      desc: "为学校量身定制AI主题研学方案，让学生走出课堂、走进前沿。",
      features: [
        {
          name: "名校参访",
          desc: "走进清华、北大、上海交大等顶尖高校AI实验室，感受前沿科研氛围，激发科学兴趣。",
        },
        {
          name: "科研院所考察",
          desc: "参访中科院、国家重点实验室等科研机构，近距离接触AI核心技术与应用场景。",
        },
        {
          name: "主题工作坊",
          desc: "围绕计算机视觉、自然语言处理、机器人等主题，开展动手实践工作坊。",
        },
        {
          name: "学术交流",
          desc: "与高校教授、研究员面对面交流，了解AI学科前沿与职业发展路径。",
        },
      ],
    },
  },
  {
    id: "enterprise",
    label: "企业定制化服务",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    content: {
      title: "企业定制化AI研学服务",
      desc: "面向企业提供子女端与员工端双重AI研学服务。",
      sections: [
        {
          label: "子女端",
          color: "#1565C0",
          items: [
            { name: "低龄兴趣启蒙", desc: "3-6岁，以游戏化方式激发AI兴趣" },
            { name: "学龄能力培养", desc: "7-12岁，系统培养编程思维与AI基础" },
            { name: "青少年职业启蒙", desc: "13-18岁，探索AI相关职业发展方向" },
          ],
        },
        {
          label: "员工端",
          color: "#D4A843",
          items: [
            { name: "职业能力提升", desc: "AI工具应用与行业AI融合实战" },
            { name: "团队建设", desc: "AI主题团建活动，激发创新协作精神" },
          ],
        },
      ],
    },
  },
  {
    id: "leadership",
    label: "高层次领导力服务",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    content: {
      title: "高层次领导力AI研学服务",
      desc: "面向政府领导、企业高管、教育管理者的高端AI研学服务。",
      themes: [
        {
          name: "数字化转型",
          desc: "深入理解AI驱动的产业数字化转型路径与最佳实践。",
        },
        {
          name: "乡村振兴",
          desc: "探索AI技术在乡村教育振兴中的创新应用与实施策略。",
        },
        {
          name: "文旅融合",
          desc: "AI赋能文化旅游产业升级的新模式与新机遇。",
        },
      ],
      partner: "联合国家开放大学等机构打造定制化研学",
    },
  },
  {
    id: "kids",
    label: "低龄群体定制化服务",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    content: {
      title: "低龄群体定制化AI研学服务",
      desc: "专为3-8岁低龄群体打造的沉浸式AI研学体验。",
      highlights: [
        {
          name: "沉浸式\u201C玩中学\u201D模式",
          desc: "通过AR/VR、互动机器人、智能积木等方式，让孩子在玩耍中自然感知AI。",
        },
        {
          name: "亲子互动项目",
          desc: "家长与孩子共同参与AI创作活动，增进亲子关系的同时培养科技素养。",
        },
        {
          name: "安全护航",
          desc: "专业安全管理团队全程陪护，确保每一位小学员的安全与舒适。",
        },
      ],
    },
  },
];

const showcaseProjects = [
  {
    title: "上外附中北京科技冬令营",
    tag: "学校研学",
    desc: "联合上海外国语大学附属中学开展为期5天的AI主题冬令营，涵盖名校参访、AI项目实战、学术报告等环节。",
    highlights: ["清华AI实验室参访", "AI项目实战挑战", "学术成果展示"],
    image: '/hero/20260331-16a96575-2a1c-4b35-813a-3a5e3346ff8a.png'
  },
  {
    title: "联想AI科创营",
    tag: "企业研学",
    desc: "为联想集团员工子女打造的AI科创夏令营，以智能硬件与AI编程为核心，培养青少年创新实践能力。",
    highlights: ["智能硬件动手实践", "AI编程工作坊", "白名单赛事辅导"],
    image: '/hero/20260331-4188da05-9914-40f3-ab6d-c9ebb5735ca3.png'
  },
  {
    title: "中欧二代AI科创营",
    tag: "高端研学",
    desc: "面向中欧国际工商学院校友子女的高端AI科创营，融合国际视野与前沿技术，打造精英AI教育体验。",
    highlights: ["国际化课程体系", "顶尖导师团队", "前沿领域科技交流"],
    image: '/hero/20260331-c8b53d28-56a2-46ae-97cf-e053c4469dbd.jpg'
  },
];

export default function AIResearchStudyClient() {
  const [activeTab, setActiveTab] = useState("school");
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch('/api/buttons/ai-research-study')
      .then(res => res.json())
      .then(setButtons)
      .catch(() => setButtons({ hero: [], cta: [] }));
  }, []);

  const currentTab = serviceTabs.find((t) => t.id === activeTab)!;

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
            <Link href="/services" className="text-gray-400 hover:text-[#1A3C8A] transition-colors">智教服务集群</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">AI研学</span>
          </nav>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1565C0] via-[#1A3C8A] to-[#0D2B6B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            智教服务集群 · 场景延伸
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            AI研学 · <span className="text-[#D4A843]">场景延伸</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            多层次、多场景研学服务体系
          </p>
          <div className="flex flex-wrap gap-4">
            {buttons.hero?.map((btn, i) => (
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
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              四大服务体系
            </h2>
            <p className="text-gray-500 text-lg">覆盖学校、企业、领导力及低龄群体的全方位研学服务</p>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
            {serviceTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 min-w-[140px] justify-center ${
                  activeTab === tab.id
                    ? "bg-[#1565C0] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{currentTab.content.title}</h3>
            <p className="text-gray-600 mb-8">{currentTab.content.desc}</p>

            {/* School tab */}
            {activeTab === "school" && "features" in currentTab.content && (
              <div className="grid sm:grid-cols-2 gap-6">
                {(currentTab.content as any).features.map((feature: { name: string; desc: string }) => (
                  <div key={feature.name} className="bg-[#F5F7FA] rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Enterprise tab */}
            {activeTab === "enterprise" && "sections" in currentTab.content && (
              <div className="space-y-8">
                {(currentTab.content as any).sections.map((section: { label: string; color: string; items: { name: string; desc: string }[] }) => (
                  <div key={section.label}>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-sm font-bold text-white px-4 py-1.5 rounded-full"
                        style={{ backgroundColor: section.color }}
                      >
                        {section.label}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.items.map((item: { name: string; desc: string }) => (
                        <div key={item.name} className="bg-[#F5F7FA] rounded-xl p-5 border border-gray-100">
                          <h5 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h5>
                          <p className="text-gray-500 text-xs">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leadership tab */}
            {activeTab === "leadership" && "themes" in currentTab.content && (
              <div>
                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  {(currentTab.content as any).themes.map((theme: { name: string; desc: string }) => (
                    <div key={theme.name} className="bg-gradient-to-b from-[#1A3C8A]/5 to-transparent rounded-xl p-6 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-2">{theme.name}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{theme.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#D4A843]/5 rounded-xl p-6 border border-[#D4A843]/20">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#D4A843] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-gray-700 text-sm">{(currentTab.content as any).partner}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Kids tab */}
            {activeTab === "kids" && "highlights" in currentTab.content && (
              <div className="grid sm:grid-cols-3 gap-6">
                {(currentTab.content as any).highlights.map((item: { name: string; desc: string }, idx: number) => (
                  <div key={idx} className="bg-gradient-to-b from-[#FFF8E1] to-white rounded-xl p-6 border border-[#D4A843]/10">
                    <div className="w-10 h-10 bg-[#D4A843]/10 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-[#D4A843] font-bold text-sm">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Showcase Projects */}
      <section id="showcase" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选案例
            </h2>
            <p className="text-gray-500 text-lg">来自不同领域的成功研学实践</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {showcaseProjects.map((project) => (
              <div
                key={project.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Image placeholder */}
                <div className="bg-gradient-to-br from-[#1565C0]/10 to-[#D4A843]/10 h-48 flex items-center justify-center">
                  <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${project.image}`}
                          className="w-full h-full object-cover"
                        />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-[#1565C0]/10 text-[#1565C0] font-medium px-3 py-1 rounded-full">
                      {project.tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.desc}</p>
                  <div className="space-y-2">
                    {project.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-[#1565C0] via-[#1A3C8A] to-[#0D2B6B] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            开启AI研学之旅
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            无论您是学校、企业还是机构，我们都能为您量身定制AI研学方案
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                className="w-full sm:w-auto px-8 py-4 bg-[#D4A843] text-white font-semibold rounded-xl hover:bg-[#c49a3a] transition-colors"
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