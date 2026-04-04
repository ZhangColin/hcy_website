"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ───────── scroll-reveal hook ───────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/* ───────── types & data ───────── */
type MainTab = "全部" | "服务院校案例" | "赛事荣誉" | "标杆项目";
const mainTabs: MainTab[] = ["全部", "服务院校案例", "赛事荣誉", "标杆项目"];

type Region = "全部" | "北京" | "上海" | "浙江" | "其他";
const regions: Region[] = ["全部", "北京", "上海", "浙江", "其他"];

type Grade = "全部" | "小学" | "初中" | "高中";
const grades: Grade[] = ["全部", "小学", "初中", "高中"];

interface SchoolCase {
  name: string;
  region: Region;
  grade: Grade[];
  abbr: string;
  partnership: string;
  results: string;
  color: string;
  coverImage?: string | null;
  schoolLogo?: string | null;
}

interface Button {
  label: string;
  href: string;
  openNewTab?: boolean;
}

interface Competition {
  title: string;
  level: string;
  achievements: string;
  year: string;
  image?: string | null;
}

const timelineAwards = [
  { year: "2021", awards: ["Intel灯塔校认证", "上海市级标准课程认证"] },
  { year: "2022", awards: ["海亮教育120所院校签约", "全国青少年AI挑战赛冠军"] },
  { year: "2023", awards: ["Intel AI全球影响力嘉年华全球总冠军", "世界机器人大赛全国冠军", "北京AI产业联盟典型案例"] },
  { year: "2024", awards: ["丘成桐中学科学奖全球总冠军", "ISEF全球总冠军", "中国教育学会典型案例"] },
  { year: "2025", awards: ["覆盖30+省市", "业务版图持续扩展"] },
];

const benchmarkProjects = [
  { title: "中关村青少年创新人才培养基地", desc: "与中关村管委会共建，打造AI创新人才培养标杆项目", tag: "政府合作" },
  { title: "文旅部高级研修项目", desc: "承接文旅部AI赋能高级研修班，培训政企骨干人才", tag: "政府合作" },
  { title: "海亮集团AI教育全面合作", desc: "120所院校集团化AI教育解决方案，全国最大规模AI教育落地项目", tag: "集团合作" },
  { title: "联想AI教育战略合作", desc: "与联想集团达成战略合作，共建AI教育硬件+软件生态", tag: "战略合作" },
];

const provinces = [
  { name: "北京", highlighted: true, row: 0, col: 3 },
  { name: "天津", highlighted: true, row: 0, col: 4 },
  { name: "河北", highlighted: true, row: 1, col: 3 },
  { name: "山西", highlighted: false, row: 1, col: 2 },
  { name: "内蒙古", highlighted: true, row: 0, col: 2 },
  { name: "辽宁", highlighted: true, row: 0, col: 5 },
  { name: "吉林", highlighted: false, row: 0, col: 6 },
  { name: "黑龙江", highlighted: true, row: 0, col: 7 },
  { name: "上海", highlighted: true, row: 2, col: 5 },
  { name: "江苏", highlighted: true, row: 2, col: 4 },
  { name: "浙江", highlighted: true, row: 2, col: 5 },
  { name: "安徽", highlighted: true, row: 2, col: 3 },
  { name: "福建", highlighted: true, row: 3, col: 5 },
  { name: "江西", highlighted: false, row: 3, col: 4 },
  { name: "山东", highlighted: true, row: 1, col: 4 },
  { name: "河南", highlighted: true, row: 2, col: 3 },
  { name: "湖北", highlighted: true, row: 2, col: 3 },
  { name: "湖南", highlighted: true, row: 3, col: 3 },
  { name: "广东", highlighted: true, row: 3, col: 4 },
  { name: "广西", highlighted: false, row: 3, col: 3 },
  { name: "海南", highlighted: false, row: 4, col: 4 },
  { name: "重庆", highlighted: true, row: 2, col: 2 },
  { name: "四川", highlighted: true, row: 2, col: 1 },
  { name: "贵州", highlighted: false, row: 3, col: 2 },
  { name: "云南", highlighted: true, row: 3, col: 1 },
  { name: "西藏", highlighted: false, row: 2, col: 0 },
  { name: "陕西", highlighted: true, row: 1, col: 2 },
  { name: "甘肃", highlighted: true, row: 1, col: 1 },
  { name: "青海", highlighted: false, row: 1, col: 0 },
  { name: "宁夏", highlighted: false, row: 1, col: 1 },
  { name: "新疆", highlighted: true, row: 0, col: 0 },
];

/* ───────── page component ───────── */
export default function CasesClient() {
  const [activeTab, setActiveTab] = useState<MainTab>("全部");
  const [regionFilter, setRegionFilter] = useState<Region>("全部");
  const [gradeFilter, setGradeFilter] = useState<Grade>("全部");
  const [schoolCases, setSchoolCases] = useState<SchoolCase[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttons, setButtons] = useState<{ cta: Button[] }>({ cta: [] });

  // Fetch buttons data
  useEffect(() => {
    fetch('/api/buttons/cases')
      .then(res => res.json())
      .then(setButtons)
      .catch(() => setButtons({ cta: [] }));
  }, []);

  // Fetch data from API on mount
  useEffect(() => {
    async function fetchCasesData() {
      try {
        const res = await fetch('/api/cases');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSchoolCases(data.schoolCases || []);
        setCompetitions(data.competitionHonors || []);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
        setError('加载数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCasesData();
  }, []);

  const heroReveal = useScrollReveal();
  const casesReveal = useScrollReveal();
  const honorsReveal = useScrollReveal();
  const mapReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const filteredCases = schoolCases.filter((c) => {
    if (regionFilter !== "全部" && c.region !== regionFilter) return false;
    if (gradeFilter !== "全部" && !c.grade.includes(gradeFilter)) return false;
    return true;
  });

  const showSchoolCases = activeTab === "全部" || activeTab === "服务院校案例";
  const showHonors = activeTab === "全部" || activeTab === "赛事荣誉";
  const showBenchmark = activeTab === "全部" || activeTab === "标杆项目";

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
            <span className="text-[#1A3C8A] font-semibold">案例与成果</span>
          </nav>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-br from-[#1A3C8A] via-[#2B6CB0] to-[#1A3C8A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4A843] rounded-full blur-3xl" />
        </div>
        <div
          ref={heroReveal.ref}
          className={`relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">案例与成果</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">见证AI教育的力量</p>
        </div>
      </section>

      {/* ── Tab Filters ── */}
      <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#1A3C8A] text-white shadow-lg shadow-[#1A3C8A]/25"
                    : "text-[#666666] hover:text-[#333333] hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── School Cases ── */}
      {showSchoolCases && (
        <section className="py-16 md:py-20">
          <div
            ref={casesReveal.ref}
            className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${casesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">服务院校案例</h2>
            <p className="text-[#666666] mb-8">累计服务130+所院校，覆盖全国30+省市</p>

            {/* filter bar */}
            <div className="flex flex-wrap gap-6 mb-10 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-[#333333] mr-1">地区：</span>
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegionFilter(r)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      regionFilter === r
                        ? "bg-[#1A3C8A] text-white shadow-md"
                        : "text-[#666666] hover:bg-gray-100 hover:text-[#333333]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-[#333333] mr-1">学段：</span>
                {grades.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGradeFilter(g)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      gradeFilter === g
                        ? "bg-[#1A3C8A] text-white shadow-md"
                        : "text-[#666666] hover:bg-gray-100 hover:text-[#333333]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* case cards */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#1A3C8A] text-white rounded-lg hover:bg-[#2B6CB0]"
                >
                  重试
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-3 border-[#1A3C8A] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-[#666666]">加载中...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((c, i) => (
                  <div
                    key={c.name}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-1"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* logo placeholder */}
                    <div className={`h-32 bg-gradient-to-br ${c.color} flex items-center justify-center relative overflow-hidden`}>
                      {c.coverImage ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${c.coverImage}`}
                          alt={c.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-40" />
                      )}
                      {c.schoolLogo ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${c.schoolLogo}`}
                          alt={`${c.name} logo`}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-white/30 relative z-10"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-2xl font-bold border border-white/30 relative z-10">
                          {c.abbr.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-[#333333]">{c.name}</h3>
                        <div className="flex gap-1">
                          {c.grade.map((g) => (
                            <span key={g} className="text-xs bg-blue-50 text-[#2B6CB0] px-2 py-0.5 rounded-full">{g}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#666666] mb-3 leading-relaxed">{c.partnership}</p>
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-[#1A3C8A] font-medium flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 text-[#D4A843] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          {c.results}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredCases.length === 0 && (
              <div className="text-center py-16 text-[#666666]">
                <div className="text-5xl mb-4">&#128269;</div>
                <p className="text-lg">暂无符合条件的案例</p>
                <p className="text-sm mt-2">请调整筛选条件</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Competition Honors ── */}
      {showHonors && (
        <section className="py-16 md:py-20 bg-white">
          <div
            ref={honorsReveal.ref}
            className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${honorsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">赛事荣誉</h2>
            <p className="text-[#666666] mb-12">以赛促学，以赛促教，培养AI创新人才</p>

            {/* honor wall - dynamic statistics */}
            {(() => {
              const intlCount = competitions.filter((c) => c.level === "国际" || c.level === "全球").length;
              const nationalCount = competitions.filter((c) => c.level === "全国").length;
              return (
                <div className="relative mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#1A3C8A] via-[#2B6CB0] to-[#1A3C8A] overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A843] rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl" />
                  </div>
                  <div className="relative text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl md:text-8xl font-black text-[#D4A843]">{intlCount}</span>
                        <span className="text-xl md:text-2xl text-white font-semibold">个国际总冠军</span>
                      </div>
                      <span className="text-3xl text-[#D4A843] font-bold">+</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl md:text-8xl font-black text-[#D4A843]">{nationalCount}</span>
                        <span className="text-xl md:text-2xl text-white font-semibold">个全国总冠军</span>
                      </div>
                    </div>
                    <p className="text-blue-200 text-lg">累计获得国际及全国重量级赛事荣誉</p>
                  </div>
                </div>
              );
            })()}

            {/* competition list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {competitions.map((comp) => (
                <div key={comp.title} className={`group bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  comp.level === "国际"
                    ? "border-amber-200 hover:border-amber-400"
                    : "border-blue-200 hover:border-blue-400"
                }`}>
                  {/* 图标/图片区域 */}
                  <div className={`h-24 flex items-center justify-center ${
                    comp.level === "国际" ? "bg-gradient-to-br from-amber-50 to-amber-100" : "bg-gradient-to-br from-blue-50 to-blue-100"
                  }`}>
                    {comp.image ? (
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${comp.image}`} alt={comp.title} className="w-16 h-16 object-contain" />
                    ) : (
                      <span className="text-4xl">🏆</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-[#333333] mb-2 line-clamp-2">{comp.title}</h4>
                    <p className={`text-sm font-medium mb-1 ${
                      comp.level === "国际" ? "text-amber-600" : "text-[#2B6CB0]"
                    }`}>{comp.achievements}</p>
                    <p className="text-xs text-[#666666]">{comp.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* timeline */}
            <h3 className="text-2xl font-bold text-[#333333] mb-8 text-center">荣誉时间线</h3>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1A3C8A] via-[#2B6CB0] to-[#D4A843]" />
              <div className="space-y-8">
                {timelineAwards.map((item, idx) => (
                  <div key={item.year} className={`relative flex items-start gap-6 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-[#1A3C8A] rounded-full flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 bg-[#D4A843] rounded-full" />
                    </div>
                    <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 bg-[#1A3C8A] text-white text-sm font-bold rounded-full mb-3">{item.year}</span>
                      <ul className="space-y-2">
                        {item.awards.map((award) => (
                          <li key={award} className="flex items-start gap-2 text-sm text-[#333333]">
                            <svg className="w-4 h-4 text-[#D4A843] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Benchmark Projects ── */}
      {showBenchmark && (
        <section className={`py-16 md:py-20 ${showHonors ? "bg-[#F5F7FA]" : "bg-white"}`}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">标杆项目</h2>
            <p className="text-[#666666] mb-10">引领行业的代表性合作项目</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benchmarkProjects.map((proj) => (
                <div key={proj.title} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#D4A843]/10 text-[#D4A843] rounded-full mb-4">{proj.tag}</span>
                  <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#1A3C8A] transition-colors">{proj.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Coverage Map ── */}
      <section className={`py-16 md:py-20 ${showBenchmark && (activeTab === "全部") ? "bg-white" : "bg-[#F5F7FA]"}`}>
        <div
          ref={mapReveal.ref}
          className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${mapReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">覆盖版图</h2>
            <p className="text-[#666666]">业务遍布全国，持续扩展中</p>
          </div>

          {/* stylized map */}
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-[#1A3C8A] to-[#2B6CB0] text-white px-8 py-4 rounded-2xl">
                <span className="text-4xl md:text-5xl font-black">30+</span>
                <span className="text-lg font-medium">省/市/自治区</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
              {provinces.map((p) => (
                <span
                  key={p.name}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    p.highlighted
                      ? "bg-gradient-to-br from-[#1A3C8A] to-[#2B6CB0] text-white shadow-md hover:shadow-lg hover:scale-105"
                      : "bg-gray-100 text-[#666666] hover:bg-gray-200"
                  }`}
                >
                  {p.name}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#666666]">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-br from-[#1A3C8A] to-[#2B6CB0]" />
                已覆盖
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gray-200" />
                规划中
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20">
        <div
          ref={ctaReveal.ref}
          className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${ctaReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="relative bg-gradient-to-br from-[#1A3C8A] via-[#2B6CB0] to-[#1A3C8A] rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4A843] rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">携手共创AI教育新未来</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                无论您是学校、教育机构还是政企单位，海创元都能为您提供专业的AI教育解决方案
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {buttons.cta?.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.href}
                    target={btn.openNewTab ? '_blank' : undefined}
                    rel={btn.openNewTab ? 'noopener noreferrer' : undefined}
                    className={i === 0
                      ? "inline-flex items-center justify-center px-8 py-4 bg-[#D4A843] hover:bg-[#c49a3a] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      : "inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300"
                    }
                  >
                    {btn.label}
                    {i === 0 && (
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
