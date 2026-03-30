"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { HeroCarousel, CounterStrip, RevealSection, PartnersWall } from "@/components/HomeClient";

interface HomePageContentProps {
  heroSlides: Array<{
    title: string;
    subtitle: string;
    cta: string;
    href: string;
    image?: string;
  }>;
  dataStrip: Array<{
    label: string;
    value: number;
    suffix: string;
  }>;
  highlights: Array<{
    title: string;
    text: string;
    image?: string;
  }>;
  partners: Array<string | { name: string; logo?: string }>;
  newsItems: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image?: string;
  }>;
}

const highlightGradients = [
  "from-[#1565C0] to-[#1A3C8A]",
  "from-[#00796B] to-[#004D40]",
  "from-[#D4A843] to-[#B8860B]",
  "from-[#2B6CB0] to-[#1A3C8A]",
];

export default function HomePageContent({
  heroSlides,
  dataStrip,
  highlights,
  partners,
  newsItems,
}: HomePageContentProps) {
  const { t } = useTranslation();

  // Business cards - using translations
  const eduCards = [
    {
      title: t("services.aiCurriculum.title"),
      desc: t("services.aiCurriculum.desc"),
      href: "/services/ai-curriculum",
    },
    {
      title: t("services.teacherTraining.title"),
      desc: t("services.teacherTraining.desc"),
      href: "/services/teacher-training",
    },
    {
      title: t("services.aiResearchStudy.title"),
      desc: t("services.aiResearchStudy.desc"),
      href: "/services/ai-research-study",
    },
    {
      title: t("services.ecosystemAlliance.title"),
      desc: t("services.ecosystemAlliance.desc"),
      href: "/services/ecosystem-alliance",
    },
  ];

  const ecoCards = [
    {
      title: t("ecosystem.enterpriseTraining.title"),
      desc: t("ecosystem.enterpriseTraining.desc"),
      href: "/ecosystem/enterprise-training",
    },
    {
      title: t("ecosystem.opc.title"),
      desc: t("ecosystem.opc.desc"),
      href: "/ecosystem/opc",
    },
    {
      title: t("ecosystem.smartServices.title"),
      desc: t("ecosystem.smartServices.desc"),
      href: "/ecosystem/smart-services",
    },
    {
      title: t("ecosystem.assetRevitalization.title"),
      desc: t("ecosystem.assetRevitalization.desc"),
      href: "/ecosystem/asset-revitalization",
    },
  ];

  const ctaButtons = [
    { label: t("home.cta.eduServices"), href: "/contact?type=智教服务集群" },
    { label: t("home.cta.ecoMatrix"), href: "/contact?type=产融生态矩阵" },
    { label: t("home.cta.enterpriseTraining"), href: "/contact?type=政企AI赋能培训" },
    { label: t("home.cta.opc"), href: "/contact?type=OPC生态" },
    { label: t("home.cta.aiPartyBuilding"), href: "/contact?type=智创专项服务" },
  ];

  return (
    <main className="flex-1">
      {/* Module 1: Hero Banner */}
      <HeroCarousel slides={heroSlides} />

      {/* Module 2: Data Strip */}
      <CounterStrip items={dataStrip} />

      {/* Module 3: Business Overview */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              {t("home.businessOverview")}
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-16 rounded-full" />
          </RevealSection>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Edu */}
            <RevealSection>
              <div>
                <h3 className="text-xl font-bold text-[#1565C0] mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#1565C0] rounded-full inline-block" />
                  {t("home.eduServices")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {eduCards.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="group block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-2 border-transparent hover:border-[#1565C0]"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#1565C0]/10 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-[#1565C0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{card.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">{card.desc}</p>
                      <span className="text-sm text-[#1565C0] group-hover:underline">
                        {t("common.learnMore")} &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Right: Eco */}
            <RevealSection>
              <div>
                <h3 className="text-xl font-bold text-[#00796B] mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#00796B] rounded-full inline-block" />
                  {t("home.ecoMatrix")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {ecoCards.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="group block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-2 border-transparent hover:border-[#00796B]"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#00796B]/10 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-[#00796B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{card.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">{card.desc}</p>
                      <span className="text-sm text-[#00796B] group-hover:underline">
                        {t("common.learnMore")} &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Module 4: Highlights */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              {t("home.highlights")}
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-16 rounded-full" />
          </RevealSection>

          <div className="flex flex-col gap-16">
            {highlights.map((item, i) => (
              <RevealSection key={item.title}>
                <div
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image or placeholder */}
                  {item.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image}`}
                      alt={item.title}
                      className="w-full md:w-1/2 aspect-[16/10] rounded-2xl object-cover shadow-lg"
                    />
                  ) : (
                    <div
                      className={`w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-gradient-to-br ${highlightGradients[i] || highlightGradients[0]} flex items-center justify-center shrink-0`}
                    >
                      <span className="text-white/80 text-6xl font-bold opacity-30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                  {/* Text */}
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-bold text-[#1A3C8A] mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.text}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Partners Wall */}
      <section className="bg-[#F5F7FA] py-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 mb-10">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              {t("home.partners")}
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto rounded-full" />
          </RevealSection>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F5F7FA] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F5F7FA] to-transparent z-10" />

          <PartnersWall partners={partners} />
        </div>
      </section>

      {/* Module 6: News Preview */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              {t("home.news")}
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-16 rounded-full" />
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <RevealSection key={news.id}>
                <Link href={`/news/${news.slug}`}>
                  <article className="bg-[#F5F7FA] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full">
                    {/* Cover image or placeholder */}
                    {news.image ? (
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${news.image}`}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-[#1A3C8A] to-[#2B6CB0] flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white/30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="p-6">
                      <time className="text-xs text-gray-400 mb-2 block">
                        {news.date.slice(0, 10)}
                      </time>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#1A3C8A] transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {news.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              </RevealSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/news"
              className="inline-block px-8 py-3 rounded-full border-2 border-[#1A3C8A] text-[#1A3C8A] font-medium hover:bg-[#1A3C8A] hover:text-white transition-colors duration-300"
            >
              {t("home.viewMore")} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Module 7: CTA Section */}
      <section className="bg-gradient-to-br from-[#0f2557] to-[#1A3C8A] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left slogan */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {t("home.cta.slogan")}
              </h2>
              <p className="text-xl text-[#D4A843]">{t("home.cta.tagline")}</p>
            </div>

            {/* Right buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {ctaButtons.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className="px-6 py-2.5 rounded-full border border-white/30 text-white hover:bg-white hover:text-[#1A3C8A] transition-colors duration-300 text-sm font-medium"
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom consultation */}
          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-block px-10 py-4 rounded-full bg-[#D4A843] text-white font-bold text-lg hover:bg-[#c49a3a] transition-colors duration-300 shadow-lg shadow-[#D4A843]/30"
            >
              {t("common.consultNow")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
