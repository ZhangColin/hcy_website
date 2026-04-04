"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SchoolCase {
  id: string;
  name: string;
  schoolLogo: string | null;
}

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

const nModules = [
  {
    id: "N1",
    title: "N1 5年免费课程更新",
    desc: "",
  },
  {
    id: "N2",
    title: "N2 等级认证",
    desc: "三端联动，覆盖课前课中课后全流程超百万播放量",
  },
  {
    id: "N3",
    title: "N3 师资解决方案",
    desc: "信息学科师训+全科素养提升",
  },
  {
    id: "N4",
    title: "N4 AI未来实验室",
    desc: "标准版/进阶版/展陈空间",
  },
  {
    id: "N5",
    title: "N5 AI研学",
    desc: "学校/企业/领导力/低龄群体",
  },
  {
    id: "N6",
    title: "N6 白名单赛事",
    desc: "国内白名单+国际赛事",
  },
  {
    id: "N7",
    title: "N7 青少年AI学院",
    desc: "与示范校共建",
  },
  {
    id: "N8",
    title: "N8 智研云平台",
    desc: "AI模型集成，PC+移动双端打通",
  },
];

const gradeData = [
  {
    grade: "小学1-3年级",
    tag: "AI启蒙",
    desc: "以趣味化、游戏化方式引入AI概念，培养学生对人工智能的初步认知与兴趣，通过图形化编程工具进行简单的AI体验。",
    color: "#4CAF50",
  },
  {
    grade: "小学4年级",
    tag: "AI基础",
    desc: "系统学习AI基础知识，了解机器学习、图像识别等核心概念，通过项目式学习完成简单AI应用的搭建与体验。",
    color: "#2196F3",
  },
  {
    grade: "小学5-6年级",
    tag: "AI进阶",
    desc: "深入学习编程思维与算法基础，掌握Python基础语法，能够利用AI工具完成创意项目，培养计算思维与问题解决能力。",
    color: "#9C27B0",
  },
  {
    grade: "初中",
    tag: "AI应用",
    desc: "系统学习人工智能原理与技术，掌握数据处理、模型训练等核心技能，能够独立完成AI项目开发与应用实践。",
    color: "#FF9800",
  },
  {
    grade: "高中",
    tag: "AI深化",
    desc: "深入学习深度学习、自然语言处理等前沿技术，具备AI项目的完整开发能力，为大学AI相关专业学习奠定基础。",
    color: "#F44336",
  },
];

export default function AICurriculumClient() {
  const [openModule, setOpenModule] = useState<string | null>("N1");
  const [schoolCases, setSchoolCases] = useState<SchoolCase[]>([]);
  const [buttons, setButtons] = useState<{ hero: Button[]; cta: Button[] }>({ hero: [], cta: [] });

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.schoolCases) {
          setSchoolCases(data.schoolCases);
        }
      })
      .catch((err) => console.error("Failed to fetch school cases:", err));
  }, []);

  useEffect(() => {
    fetch('/api/buttons/ai-curriculum')
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
            <span className="text-[#1A3C8A] font-semibold">AI课程入校</span>
          </nav>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1565C0] via-[#1A3C8A] to-[#0D2B6B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            智教服务集群 · 核心产品
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            AI课程入校 · <span className="text-[#D4A843]">核心引擎</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            1+N综合解决方案，覆盖小/初/高全学段
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

      {/* Product Advantages */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              产品优势
            </h2>
            <p className="text-gray-500 text-lg">深耕AI教育领域，构建差异化竞争壁垒</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-[#1565C0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#1565C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5年课堂实践打磨</h3>
              <p className="text-gray-600 leading-relaxed">
                唯一历经教育部直属上海外国语附属中学 5 年真实课堂实践深度打磨的 AI 课程体系，作为国内中小学 AI 教育课程体系核心发源地，依托名校教研积淀，打造兼具专业性、落地性、体系化的基础教育 AI 课程解决方案。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-[#1565C0]/10 text-[#1565C0] px-3 py-1 rounded-full">教育部直属</span>
                <span className="text-xs bg-[#D4A843]/10 text-[#D4A843] px-3 py-1 rounded-full">央视深度报道</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-[#D4A843]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#D4A843]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">破解AI进校五大难题</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                系统性解决AI教育落地过程中面临的核心挑战，让AI课程真正走进每一间教室。
              </p>
              <div className="space-y-2">
                {["课程缺位", "师资匮乏", "设施不足", "平台稀缺", "机制断点"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-[#2B6CB0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#2B6CB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">政策适配</h3>
              <p className="text-gray-600 leading-relaxed">
                完整适配教育部《关于加强中小学人工智能教育的通知》，从课程建设、师资培养到评价体系，实现六大任务的完整适配与落地。
              </p>
              <div className="mt-4">
                <span className="text-xs bg-[#2B6CB0]/10 text-[#2B6CB0] px-3 py-1 rounded-full">政策完整适配</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1+N Model */}
      <section id="model" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              1+N 综合解决方案
            </h2>
            <p className="text-gray-500 text-lg">AI课程入校综合解决方案</p>
          </div>

          {/* Core "1" */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-[#1565C0] to-[#1A3C8A] rounded-2xl p-8 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#D4A843] text-white text-2xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
                  1
                </span>
                <h3 className="text-2xl font-bold">核心课程体系</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-[#D4A843] font-semibold mb-2">人工智能课程</div>
                  <p className="text-white/80 text-sm">覆盖全学段：小学1-3年级综合实践 → 小学4年级MIT科普课 → 小学5-6年级通识 → 初中通识+科创班 → 高中通识+科创班</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-[#D4A843] font-semibold mb-2">教学平台</div>
                  <p className="text-white/80 text-sm">SAAS三端联动：教师端-学生端-展示端，课前资料云端同步、课中60+课堂互动、课后作业智能统计</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-[#D4A843] font-semibold mb-2">课案与学案</div>
                  <p className="text-white/80 text-sm">针对课程匹配教案、案例、软硬件指导，完整适配教育部《关于加强中小学人工智能教育的通知》六大任务</p>
                </div>
              </div>
            </div>
          </div>

          {/* "N" Modules Accordion */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#1565C0] text-white text-2xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
                N
              </span>
              <h3 className="text-2xl font-bold text-gray-900">可配选的增值服务</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {nModules.map((mod) => (
                <div
                  key={mod.id}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-[#1565C0]/30 transition-colors"
                >
                  <button
                    onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#1565C0] bg-[#1565C0]/10 px-2.5 py-1 rounded-md">
                        {mod.id}
                      </span>
                      <span className="font-semibold text-gray-900">{mod.title}</span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        openModule === mod.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openModule === mod.id && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-gray-600 text-sm leading-relaxed pl-12">{mod.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grade Curriculum */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              全学段课程体系
            </h2>
            <p className="text-gray-500 text-lg">从小学到高中，循序渐进的AI课程规划</p>
          </div>
          {/* Horizontal scroll on mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-5">
              {gradeData.map((item, idx) => (
                <div key={item.grade} className="flex flex-col items-center w-56 md:w-auto">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full w-full">
                    <div
                      className="inline-block text-xs font-bold text-white px-3 py-1 rounded-full mb-4"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.tag}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{item.grade}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three-Terminal Platform */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              三端联动教学平台
            </h2>
            <p className="text-gray-500 text-lg">课前-课中-课后全流程数字化教学支撑</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* 课前 */}
            <div className="relative bg-gradient-to-b from-[#E8F0FE] to-white rounded-2xl p-8 border border-[#1565C0]/10">
              <div className="absolute -top-4 left-8 bg-[#1565C0] text-white text-sm font-bold px-4 py-1.5 rounded-full">
                课前
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900 mb-4">资料云端同步</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#1565C0] rounded-full mt-1.5 flex-shrink-0" />
                    教学资源一键下发
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#1565C0] rounded-full mt-1.5 flex-shrink-0" />
                    课案学案自动同步
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#1565C0] rounded-full mt-1.5 flex-shrink-0" />
                    预习任务在线布置
                  </li>
                </ul>
              </div>
            </div>
            {/* 课中 */}
            <div className="relative bg-gradient-to-b from-[#FFF8E1] to-white rounded-2xl p-8 border border-[#D4A843]/10">
              <div className="absolute -top-4 left-8 bg-[#D4A843] text-white text-sm font-bold px-4 py-1.5 rounded-full">
                课中
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900 mb-4">智慧课堂互动</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full mt-1.5 flex-shrink-0" />
                    60+课堂互动功能
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full mt-1.5 flex-shrink-0" />
                    黑屏管控 / 屏幕广播
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full mt-1.5 flex-shrink-0" />
                    分组教学与协作
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full mt-1.5 flex-shrink-0" />
                    实时学情监测
                  </li>
                </ul>
              </div>
            </div>
            {/* 课后 */}
            <div className="relative bg-gradient-to-b from-[#E8F5E9] to-white rounded-2xl p-8 border border-green-200">
              <div className="absolute -top-4 left-8 bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                课后
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900 mb-4">作业智能管理</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    作业智能统计分析
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    云端自动批改
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    学习报告自动生成
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              硬件配套
            </h2>
            <p className="text-gray-500 text-lg">自研AI教学终端设备，满足不同场景需求</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* STD-1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="bg-gray-100 h-56 flex items-center justify-center">
                <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/hero/20260401-33692ee9-2a99-43f7-9056-8a89e5716d57.png`}
                          className="w-full h-full object-cover"
                        />
              </div>
              <div className="p-8">
                <div className="inline-block bg-[#1565C0]/10 text-[#1565C0] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  基础型
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">STD-1 基础型</h4>
                <p className="text-gray-600 text-sm mb-4">适用于AI课程基础教学场景，满足图形化编程与基础AI实验需求。</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>处理器</span>
                    <span className="text-gray-700">英特尔酷睿 i7-12400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>内存</span>
                    <span className="text-gray-700">16GB DDR4 3200MHz </span>
                  </div>
                  <div className="flex justify-between">
                    <span>存储</span>
                    <span className="text-gray-700">512GB NVMe M.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPU</span>
                    <span className="text-gray-700">NVIDIA RTX 4070 Ti 12GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>算力</span>
                    <span className="text-gray-700">单精度浮点算力超 40 TFLOPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>显存</span>
                    <span className="text-gray-700">12GB GDDR6X </span>
                  </div>
                </div>
              </div>
            </div>
            {/* SMU-1/SMU-2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="bg-gradient-to-br from-[#1A3C8A]/5 to-[#D4A843]/5 h-56 flex items-center justify-center">
                <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/hero/20260401-6ebaa752-bdd8-4609-b8f4-c99bbab0558d.png`}
                          className="w-full h-full object-cover"
                        />
              </div>
              <div className="p-8">
                <div className="inline-block bg-[#D4A843]/10 text-[#D4A843] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  智算型
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">SMU-1 / SMU-2 智算型</h4>
                <p className="text-gray-600 text-sm mb-4">适用于AI深度学习与模型训练场景，支持GPU加速计算与大模型推理。</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>处理器</span>
                    <span className="text-gray-700">U7 265K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>内存</span>
                    <span className="text-gray-700">16GB DDR4 3200MHz </span>
                  </div>
                  <div className="flex justify-between">
                    <span>存储</span>
                    <span className="text-gray-700">512GB NVMe M.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPU</span>
                    <span className="text-gray-700">NVIDIA RTX 4090 24GB </span>
                  </div>
                  <div className="flex justify-between">
                    <span>算力</span>
                    <span className="text-gray-700">单精度浮点算力超 80 TFLOPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>显存</span>
                    <span className="text-gray-700">24GB GDDR6X</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Research Cloud Platform */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              智研云平台
            </h2>
            <p className="text-gray-500 text-lg">一站式AI教研协同平台，数据驱动教学决策</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  { title: "课程管理中心", desc: "统一管理AI课程资源，支持多版本课程并行管理与按需分发。" },
                  { title: "教学数据分析", desc: "多维度学情分析看板，实时掌握教学效果，精准教学干预。" },
                  { title: "区域教研协同", desc: "支持区域级教研活动组织与教学成果共享，促进均衡发展。" },
                  { title: "资源共享中心", desc: "优秀课案、学案、教学素材云端共享，降低教师备课负担。" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#1565C0]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1565C0] font-bold text-sm">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
              <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/hero/20260331-042f9812-1f6c-46c6-86e7-58066bb9f466.png`}
                          className="w-full h-full object-cover"
                        />
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              合作学校
            </h2>
            <p className="text-gray-500 text-lg">覆盖全国多个省市的优质合作院校</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {schoolCases.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100 hover:border-[#1565C0]/30 hover:shadow-md transition-all h-28"
              >
                {school.schoolLogo && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${school.schoolLogo}`}
                    alt={school.name}
                    className="w-12 h-12 object-contain mb-2"
                  />
                )}
                <span className="text-gray-700 font-medium text-sm text-center">{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-[#1565C0] via-[#1A3C8A] to-[#0D2B6B] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            开启AI课程入校之旅
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            立即预约课程演示，了解1+N综合解决方案如何助力贵校AI教育落地
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
