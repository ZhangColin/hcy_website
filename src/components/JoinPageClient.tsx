"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

/* ───────── types ───────── */
interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[] | unknown; // 支持从数据库的 JsonValue 类型
}

interface JoinData {
  jobPositions: JobPosition[];
}

interface JoinPageClientProps {
  data: JoinData;
  hrEmail?: string | null;
}

/* ───────── reveal hook ───────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/* ───────── OPC benefits (static, contains JSX icons) ───────── */
const opcBenefits = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
        />
      </svg>
    ),
    title: "系统化培训",
    desc: "L1/L2/L3三级课程体系，从入门到精通",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    ),
    title: "真实订单",
    desc: "六大订单类型，培训即就业",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
    title: "国企背书",
    desc: "海淀国投集团全资企业信用保障",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
        />
      </svg>
    ),
    title: "成长路径",
    desc: "C级→B级→A级三级能力晋升体系",
  },
];

/* ───────── main client component ───────── */
export default function JoinPageClient({ data, hrEmail }: JoinPageClientProps) {
  const { t } = useTranslation();
  const defaultHrEmail = "hr@aieducenter.com"; // 默认 HR 邮箱
  const displayHrEmail = hrEmail || defaultHrEmail;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1A3C8A] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t("common.home")}
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">{t("join.breadcrumb.current")}</span>
          </nav>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("join.title")}</h1>
          <p className="text-xl text-blue-100">
            {t("join.subtitle")}
          </p>
        </div>
      </section>

      {/* Talent Recruitment */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1A3C8A] mb-4">
                人才招聘
              </h2>
              <p className="text-[#666] text-lg">
                我们期待志同道合的你加入，共同推动AI教育事业发展
              </p>
            </div>
          </RevealSection>

          <div className="space-y-6">
            {data.jobPositions.map((job) => (
              <RevealSection key={job.id}>
                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-[#333]">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-[#1A3C8A]/10 text-[#1A3C8A] text-sm rounded-full">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-[#666] text-sm">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                            />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-[#666] transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#333] mb-2">
                        岗位职责
                      </h4>
                      <p className="text-[#666]">{job.description}</p>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#333] mb-2">
                        任职要求
                      </h4>
                      <ul className="list-disc list-inside text-[#666] space-y-1">
                        {Array.isArray(job.requirements) && job.requirements.map((req, i) => (
                          <li key={i}>{String(req)}</li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={`mailto:${displayHrEmail}?subject=应聘${encodeURIComponent(job.title)}-${encodeURIComponent(job.department)}`}
                      className="px-6 py-2.5 bg-[#1A3C8A] text-white rounded hover:bg-[#2B6CB0] transition-colors inline-block"
                    >
                      投递简历
                    </a>
                  </div>
                </details>
              </RevealSection>
            ))}
          </div>

          <RevealSection className="mt-8 text-center">
            <p className="text-[#666]">
              投递简历请发送至：
              <a
                href={`mailto:${displayHrEmail}`}
                className="text-[#2B6CB0] hover:underline"
              >
                {displayHrEmail}
              </a>
            </p>
          </RevealSection>
        </div>
      </section>

      {/* OPC Recruitment */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#00796B] mb-4">
                OPC超级个体招募
              </h2>
              <p className="text-[#666] text-lg">
                加入OPC生态，以真实订单激活你的超级个体潜能
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {opcBenefits.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#00796B]/10 rounded-full flex items-center justify-center text-[#00796B]">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#333] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#666]">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* OPC Course Tiers */}
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  level: "L1",
                  name: "基础版",
                  hours: "8学时",
                  price: "1,200",
                  color: "#2B6CB0",
                  features: [
                    "AI工具基础操作",
                    "提示词工程入门",
                    "基础内容创作",
                  ],
                },
                {
                  level: "L2",
                  name: "进阶版",
                  hours: "20学时",
                  price: "3,800",
                  color: "#1A3C8A",
                  features: [
                    "多模态AI应用",
                    "项目实战训练",
                    "接单流程与规范",
                  ],
                },
                {
                  level: "L3",
                  name: "高级版",
                  hours: "30学时",
                  price: "6,800",
                  color: "#00796B",
                  features: [
                    "复杂项目交付",
                    "团队管理能力",
                    "A级订单承接资格",
                  ],
                },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div
                    className="p-6 text-white text-center"
                    style={{ backgroundColor: tier.color }}
                  >
                    <div className="text-sm font-medium opacity-80">
                      {tier.level}
                    </div>
                    <div className="text-2xl font-bold mt-1">{tier.name}</div>
                    <div className="text-sm opacity-80 mt-1">{tier.hours}</div>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-[#333]">
                        ¥{tier.price}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[#666]"
                        >
                          <svg
                            className="w-5 h-5 text-green-500 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ecosystem/opc"
                className="inline-block px-8 py-3 bg-[#00796B] text-white font-semibold rounded hover:bg-[#00695C] transition-colors"
              >
                了解OPC生态详情
              </Link>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 border-2 border-[#00796B] text-[#00796B] font-semibold rounded hover:bg-[#00796B] hover:text-white transition-colors"
              >
                立即报名
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Why Join CTA */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">为什么选择海创元？</h2>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { title: "国企平台", desc: "海淀国投集团全资企业，稳健可靠" },
              {
                title: "前沿赛道",
                desc: "AI教育行业领跑者，把握时代机遇",
              },
              { title: "快速成长", desc: "多业务线协同，职业发展空间广阔" },
              {
                title: "优质团队",
                desc: "汇聚教育与AI领域顶尖人才",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold text-[#D4A843] mb-3">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-[#D4A843] text-white text-lg font-bold rounded hover:bg-[#c49a3a] transition-colors"
          >
            联系我们
          </Link>
        </div>
      </section>
    </>
  );
}
