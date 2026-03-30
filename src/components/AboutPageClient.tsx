"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

/* ───────── types ───────── */
interface AboutData {
  intro: {
    title: string;
    subtitle: string;
    description: string;
  };
  culture: {
    mission: string;
    vision: string;
    values: string[];
  };
  timeline: { year: string; title: string; desc: string }[];
  honors: { title: string; category: string; image?: string }[];
  partners: {
    strategic: Array<{ name: string; logo?: string }>;
    ecosystem: Array<{ name: string; logo?: string }>;
  };
}

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

/* ───────── static data ───────── */
const stats = [
  { value: "30+", label: "覆盖省市" },
  { value: "130+", label: "服务院校" },
  { value: "70+", label: "合作渠道" },
];

const valueIcons: Record<string, string> = {
  "国企担当": "🏛",
  "创新驱动": "💡",
  "生态共赢": "🌐",
  "实战为本": "🎯",
  "教育为本": "🎯",
};

const valueDescs: Record<string, string> = {
  "国企担当": "秉承国有企业社会责任，以教育公平为己任",
  "创新驱动": "以AI技术为核心驱动力，持续引领教育变革",
  "生态共赢": "构建开放合作生态，与伙伴共享发展红利",
  "实战为本": "聚焦实际应用场景，培养新质生产力人才",
  "教育为本": "聚焦教育本质，培养面向未来的创新人才",
};

const honorGradients: Record<string, string> = {
  "行业荣誉": "from-blue-600 to-indigo-700",
  "赛事成就": "from-yellow-500 to-amber-600",
  "合作认证": "from-teal-500 to-green-600",
  "软著专利": "from-purple-500 to-pink-600",
};

const honorTabs = ["全部", "行业荣誉", "赛事成就", "合作认证", "软著专利"] as const;
type HonorTab = (typeof honorTabs)[number];

/* ───────── Partner Card Component ───────── */
function PartnerCard({ partner, gradient }: { partner: { name: string; logo?: string }; gradient: string }) {
  const logoUrl = partner.logo
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${partner.logo}`
    : undefined;
  const initial = partner.name ? partner.name[0] : "?";

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:border-[#1A3C8A]/20 transition-all duration-300">
      {logoUrl ? (
        <img src={logoUrl} alt={partner.name} className="w-20 h-20 object-contain" />
      ) : (
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg`}>
          {initial}
        </div>
      )}
      <span className="font-semibold text-gray-700 text-center text-sm">{partner.name}</span>
    </div>
  );
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

/* ───────── Timeline Item ───────── */
function TimelineItem({
  milestone,
  isLeft,
  index,
  total,
}: {
  milestone: { year: string; title: string; desc: string };
  isLeft: boolean;
  index: number;
  total: number;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative md:flex md:items-center md:mb-12 transition-all duration-700 delay-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* mobile layout */}
      <div className="md:hidden flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-[#1A3C8A] ring-4 ring-[#1A3C8A]/20" />
          {index < total - 1 && (
            <div className="w-px flex-1 bg-[#1A3C8A]/20 mt-1" />
          )}
        </div>
        <div className="pb-8">
          <span className="text-xs font-semibold text-[#D4A843]">{milestone.year}</span>
          <h4 className="text-base font-bold text-[#1A3C8A] mt-1">{milestone.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{milestone.desc}</p>
        </div>
      </div>

      {/* desktop layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_40px_1fr] md:gap-4 w-full">
        {/* left content */}
        <div className={`${isLeft ? "text-right pr-4" : ""}`}>
          {isLeft && (
            <div className="inline-block rounded-xl bg-white shadow-sm border border-gray-100 p-5 text-left max-w-md ml-auto">
              <span className="text-xs font-semibold text-[#D4A843]">{milestone.year}</span>
              <h4 className="text-base font-bold text-[#1A3C8A] mt-1">{milestone.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{milestone.desc}</p>
            </div>
          )}
        </div>

        {/* dot */}
        <div className="flex justify-center">
          <div className="w-4 h-4 rounded-full bg-[#1A3C8A] ring-4 ring-[#1A3C8A]/20 mt-5" />
        </div>

        {/* right content */}
        <div className={`${!isLeft ? "pl-4" : ""}`}>
          {!isLeft && (
            <div className="inline-block rounded-xl bg-white shadow-sm border border-gray-100 p-5 max-w-md">
              <span className="text-xs font-semibold text-[#D4A843]">{milestone.year}</span>
              <h4 className="text-base font-bold text-[#1A3C8A] mt-1">{milestone.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{milestone.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── main client component ───────── */
export default function AboutPageClient({ data }: { data: AboutData }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<HonorTab>("全部");

  const honorsWithGradient = data.honors.map((h) => ({
    ...h,
    gradient: honorGradients[h.category] || "from-blue-600 to-indigo-700",
  }));

  const filteredHonors =
    activeTab === "全部"
      ? honorsWithGradient
      : honorsWithGradient.filter((h) => h.category === activeTab);

  const valuesData = data.culture.values.map((v) => ({
    icon: valueIcons[v] || "💡",
    title: v,
    desc: valueDescs[v] || "",
  }));

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-800">
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
            <span className="text-[#1A3C8A] font-semibold">{t("about.breadcrumb.current")}</span>
          </nav>
        </div>
      </nav>

      {/* ====== Hero Banner ====== */}
      <div className="relative w-full bg-gradient-to-br from-[#1A3C8A] via-[#1e4a9e] to-[#2B6CB0] text-white overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{data.intro.title}</h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
            {data.intro.subtitle}
          </p>
        </div>
      </div>

      {/* ====== Company Introduction ====== */}
      <Section className="py-20 md:py-28" id="intro">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            {/* text */}
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-bold text-[#1A3C8A]">{t("about.companyIntro")}</h2>

              <span className="inline-block rounded-full bg-[#D4A843]/15 text-[#b8922e] px-4 py-1.5 text-sm font-semibold border border-[#D4A843]/30">
                {t("about.subsidiary")}
              </span>

              <p className="text-gray-600 leading-8 text-[15px]">
                {data.intro.description}
              </p>
            </div>

            {/* stats */}
            <div className="md:col-span-2 grid grid-cols-3 md:grid-cols-1 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white shadow-md p-6 text-center md:text-left border border-gray-100"
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-[#1A3C8A]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{t(`about.stats.${s.label === "覆盖省市" ? "coverage" : s.label === "服务院校" ? "schools" : "channels"}`)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ====== Culture & Mission ====== */}
      <Section className="py-20 md:py-28 bg-white" id="culture">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("about.culture")}</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {t("about.cultureDesc")}
          </p>

          {/* mission & vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div className="rounded-2xl bg-gradient-to-br from-[#1A3C8A] to-[#2B6CB0] text-white p-8 md:p-10">
              <div className="text-sm font-medium text-blue-200 mb-2 tracking-wider uppercase">
                {t("about.mission")} Mission
              </div>
              <div className="text-2xl md:text-3xl font-bold leading-snug">
                {data.culture.mission}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#D4A843] to-[#c49530] text-white p-8 md:p-10">
              <div className="text-sm font-medium text-yellow-100 mb-2 tracking-wider uppercase">
                {t("about.vision")} Vision
              </div>
              <div className="text-2xl md:text-3xl font-bold leading-snug">
                {data.culture.vision}
              </div>
            </div>
          </div>

          {/* values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valuesData.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl bg-[#F5F7FA] hover:bg-white hover:shadow-lg transition-all duration-300 p-6 text-center border border-transparent hover:border-gray-100"
              >
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="text-lg font-bold text-[#1A3C8A] mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ====== Development Timeline ====== */}
      <Section className="py-20 md:py-28" id="timeline">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("about.timeline")}</h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            {t("about.timelineDesc")}
          </p>

          <div className="relative">
            {/* center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#1A3C8A]/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-0">
              {data.timeline.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <TimelineItem key={i} milestone={m} isLeft={isLeft} index={i} total={data.timeline.length} />
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ====== Honors ====== */}
      <Section className="py-20 md:py-28 bg-white" id="honors">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("about.honors")}</h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            {t("about.honorsDesc")}
          </p>

          {/* tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {honorTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#1A3C8A] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHonors.map((h) => {
              const imageUrl = h.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${h.image}`
                : undefined;

              return (
                <div
                  key={h.title}
                  className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div
                    className={`h-40 bg-gradient-to-br ${h.gradient} flex items-center justify-center relative`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={h.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-14 h-14 text-white/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 13.125 10.875h-2.25A3.375 3.375 0 0 0 7.5 14.25v4.5m4.5-12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-[#1A3C8A]/10 text-[#1A3C8A] text-xs font-medium px-3 py-1 mb-3">
                      {h.category}
                    </span>
                    <h3 className="font-bold text-gray-800 group-hover:text-[#1A3C8A] transition-colors">
                      {h.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ====== Partners ====== */}
      <Section className="py-20 md:py-28" id="partners">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("about.partners")}</h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            {t("about.partnersDesc")}
          </p>

          {/* strategic */}
          <div className="mb-14">
            <h3 className="text-lg font-bold text-[#1A3C8A] mb-6 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#D4A843] inline-block" />
              {t("about.strategicPartners")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.partners.strategic.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} gradient="from-[#1A3C8A] to-[#2B6CB0]" />
              ))}
            </div>
          </div>

          {/* ecosystem */}
          <div className="mb-14">
            <h3 className="text-lg font-bold text-[#1A3C8A] mb-6 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#2B6CB0] inline-block" />
              {t("about.ecosystemPartners")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.partners.ecosystem.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} gradient="from-[#2B6CB0] to-[#4299e1]" />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
