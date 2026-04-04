// @ts-nocheck
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const certLevels = [
  {
    level: "初级",
    color: "#4CAF50",
    desc: "掌握AI基础知识与教学工具使用，能够开展AI启蒙教学活动。",
    audience: "入门教师",
  },
  {
    level: "中级",
    color: "#1565C0",
    desc: "熟练运用AI教学平台与工具，能够独立设计并实施AI课程教学。",
    audience: "骨干教师",
  },
  {
    level: "高级",
    color: "#D4A843",
    desc: "具备AI课程研发与教研管理能力，能够带领团队开展AI教育创新实践。",
    audience: "学科带头人",
  },
];

const careerPaths = [
  { title: "AI课程设计师", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { title: "校园智教专家", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { title: "数字化教研员", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { title: "独立AI教育创客", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
];

export default function TeacherTrainingClient() {
  const [experts, setExperts] = useState<Array<{
    id: string;
    name: string;
    title: string;
    org: string;
    focus: string;
    avatar: string | null;
  }>>([]);
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch("/api/public/experts")
      .then((res) => res.json())
      .then((data) => setExperts(data))
      .catch(() => setExperts([]));
  }, []);

  useEffect(() => {
    fetch('/api/buttons/teacher-training')
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
            <Link href="/services" className="text-gray-400 hover:text-[#1A3C8A] transition-colors">智教服务集群</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">AI师资培训与等级认证</span>
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
            智教服务集群 · 配套刚需
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            AI师资培训与等级认证
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            双轨培训+国家级认证，打造&ldquo;培训&mdash;认证&mdash;持证上岗&rdquo;闭环
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

      {/* Dual-Track Training */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              双轨培训体系
            </h2>
            <p className="text-gray-500 text-lg">分层分类，精准赋能不同背景教师</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Track 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="bg-gradient-to-r from-[#1565C0] to-[#2B6CB0] p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">信息学科教师</h3>
                    <p className="text-white/70 text-sm">专业化培训</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#1565C0]/10 text-[#1565C0] text-xs font-bold px-3 py-1 rounded-full">
                        线下专项
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      AI课程教学方法论，深度解读国家人工智能教育大纲，拆解从小学启蒙到高中进阶的知识梯度。<br/>
多维平台操作实训， 智研云等主流AI教学平台深度实操，涵盖计算机视觉、自然语言处理。<br/>
智能课堂管理技巧，针对AI课堂中软硬件结合、小组分工、即时反馈等难点，传授高效的课堂组织经验。<br/>
AI+PBL案例式教学，由资深专家团带队，结合生活场景（如智慧社区、人脸识别闸机）进行项目制学习（PBL）设计。
                    </p>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#2B6CB0]/10 text-[#2B6CB0] text-xs font-bold px-3 py-1 rounded-full">
                        线上数字人
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      7×24小时数字人“专家顾问”，集成海量AI教育知识库，数字导师实时在线。无论是复杂的算法逻辑（如卷积神经网络）还是具体的教案调整建议，均可即时语音/文字交互。<br/>
个性化学习路径推荐，通过线上自测，AI数字人将根据教师的初始能力值（基础型、进阶型、专家型），量身定制专属的职业成长地图。<br/>
实时教学模拟与反馈，教师可与数字人进行“模拟课堂”对话。数字人模拟学生提问或课堂突发状况，磨炼教师的应变能力与知识传递效率。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Track 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="bg-gradient-to-r from-[#D4A843] to-[#E8C167] p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">非信息学科教师</h3>
                    <p className="text-white/70 text-sm">AI素养提升</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 text-sm mb-6">六大教学专题，全面提升跨学科教师的AI应用能力：</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "指令工程", desc: "学习如何与AI深度对话。掌握结构化提词技巧（如角色定位、任务拆解、限制条件），精准驱动AI生成教学设计、教案及试卷。" },
                    { name: "视觉设计", desc: "掌握AI辅助教学素材创作。利用文生图技术制作精美的PPT配图、教学插画、甚至还原历史场景或文学意境。" },
                    { name: "多模态视频", desc: "学习AI视频生成与剪辑。通过文本一键生成教学微课视频，利用AI配音、数字人出镜、自动字幕技术提升微课制作效率。" },
                    { name: "AI编程", desc: "零基础AI编程入门。学习利用大模型辅助编写简单的教学小程序或自动化办公脚本（如成绩自动分析工具、课堂互动小游戏）。" },
                    { name: "综合实战", desc: "跨学科AI教学深度实践。将前四大专题能力整合，输出一套完整的“AI+学科”融合方案，如《AI辅助下的古诗词鉴赏》或《数据驱动的地理探究》。" },
                    { name: "AI心理测评", desc: "多维情绪自动感知、对话式心理初筛、跨学科“心理+教学”融合、24h数字心理树洞。" },
                  ].map((topic) => (
                    <div key={topic.name} className="bg-[#F5F7FA] rounded-xl p-4">
                      <div className="font-semibold text-gray-900 text-sm mb-1">{topic.name}</div>
                      <p className="text-gray-500 text-xs">{topic.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* National Certification */}
      <section id="certification" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              国家级等级认证
            </h2>
            <p className="text-gray-500 text-lg">工业和信息化部教育与考试中心权威颁证</p>
          </div>

          {/* Issuing Authority */}
          <div className="bg-gradient-to-r from-[#1A3C8A]/5 to-[#D4A843]/5 rounded-2xl p-8 mb-12 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-[#1A3C8A]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-[#1A3C8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">颁证机构</h3>
                <p className="text-[#1A3C8A] font-semibold text-lg">工业和信息化部教育与考试中心</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="text-xs bg-[#1565C0]/10 text-[#1565C0] px-3 py-1 rounded-full">全国通用</span>
                  <span className="text-xs bg-[#D4A843]/10 text-[#D4A843] px-3 py-1 rounded-full">有效期5年</span>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">学完即考即持证</span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Levels */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {certLevels.map((item) => (
              <div key={item.level} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.level.charAt(0)}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.level}认证</h4>
                <p className="text-gray-500 text-xs mb-3">适合：{item.audience}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Four Career Directions */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">四大职业方向</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {careerPaths.map((path) => (
                <div key={path.title} className="bg-[#F5F7FA] rounded-xl p-6 text-center hover:bg-[#1565C0]/5 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg className="w-6 h-6 text-[#1565C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path.icon} />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{path.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Data */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#1565C0] to-[#1A3C8A] rounded-2xl p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 text-center">
              <div>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  1000<span className="text-[#D4A843]">+</span>
                </div>
                <p className="text-white/70 text-lg">累计授课课时</p>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  ~100<span className="text-[#D4A843]">%</span>
                </div>
                <p className="text-white/70 text-lg">学员满意度</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              专家团队
            </h2>
            <p className="text-gray-500 text-lg">汇聚顶尖AI教育领域专家学者</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-[#F5F7FA] rounded-2xl p-6 hover:shadow-md transition-shadow">
                {expert.avatar ? (
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1565C0]/20 to-[#D4A843]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-1">{expert.name}</h4>
                  <p className="text-[#1565C0] text-sm font-medium mb-1">{expert.title}</p>
                  <p className="text-gray-500 text-xs mb-2">{expert.org}</p>
                  <p className="text-gray-400 text-xs">研究方向：{expert.focus}</p>
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
            提升AI教学能力，从这里开始
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            预约师资培训，了解国家级AI教师认证方案，打造持证上岗的AI师资队伍
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