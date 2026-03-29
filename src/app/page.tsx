import Link from "next/link";
import { loadData } from "@/lib/data";
import { HeroCarousel, CounterStrip, RevealSection, PartnersWall } from "@/components/HomeClient";

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

/* ─── Business Cards (static) ─── */
const eduCards = [
  {
    title: "AI课程入校",
    desc: "1+N综合解决方案，覆盖小初高全学段",
    href: "/services/ai-curriculum",
  },
  {
    title: "AI师资培训与认证",
    desc: "工信部权威认证，初/中/高三级体系",
    href: "/services/teacher-training",
  },
  {
    title: "AI研学",
    desc: "沉浸式AI科技研学体验营",
    href: "/services/ai-research-study",
  },
  {
    title: "生态产品联盟",
    desc: "优质AI教育产品集成与推荐",
    href: "/services/ecosystem-alliance",
  },
];

const ecoCards = [
  {
    title: "政企AI赋能培训",
    desc: "定制化AI转型培训方案",
    href: "/ecosystem/enterprise-training",
  },
  {
    title: "OPC生态",
    desc: "培训即就业，真实订单驱动",
    href: "/ecosystem/opc",
  },
  {
    title: "智创专项服务",
    desc: "AI创新项目孵化与技术支持",
    href: "/ecosystem/smart-services",
  },
  {
    title: "不良资产盘活",
    desc: "AI赋能资产处置与价值重塑",
    href: "/ecosystem/asset-revitalization",
  },
];

/* ─── CTA Contact Buttons (static) ─── */
const ctaButtons = [
  { label: "智教服务", href: "/contact?type=智教服务集群" },
  { label: "产融生态", href: "/contact?type=产融生态矩阵" },
  { label: "政企培训", href: "/contact?type=政企AI赋能培训" },
  { label: "OPC生态", href: "/contact?type=OPC生态" },
  { label: "AI党建", href: "/contact?type=智创专项服务" },
];

/* ─── Highlight gradient mapping ─── */
const highlightGradients = [
  "from-[#1565C0] to-[#1A3C8A]",
  "from-[#00796B] to-[#004D40]",
  "from-[#D4A843] to-[#B8860B]",
  "from-[#2B6CB0] to-[#1A3C8A]",
];

/* ═══════════════════════════════════════════════════════════
   HOME PAGE (Server Component)
   ═══════════════════════════════════════════════════════════ */
export default async function Home() {
  const homeData = await loadData("home");
  const newsData = await loadData("news");

  // Normalize heroSlides data - ensure required fields exist
  const heroSlides = homeData.heroSlides.map((slide: any) => ({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    cta: slide.cta || "了解更多",
    href: slide.href || "/contact",
  }));
  // Convert dataStrip format from {title, value} to {label, value, suffix}
  const dataStrip = homeData.dataStrip.map((item: any) => ({
    label: item.title || item.label || "",
    value: typeof item.value === 'number' ? item.value : parseInt(item.value?.replace(/\D/g, '') || '0'),
    suffix: item.suffix || (typeof item.value === 'string' && item.value?.includes('+') ? '+' : ''),
  }));
  // highlights 现在包含可选的 image 字段
  interface HighlightItem {
    title: string;
    text: string;
    image?: string;
  }
  const highlights = homeData.highlights;
  const partners = homeData.partners;
  const newsItems = newsData.articles.slice(0, 3);

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <main className="flex-1">
      {/* ──────── Module 1: Hero Banner ──────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ──────── Module 2: Data Strip ──────── */}
      <CounterStrip items={dataStrip} />

      {/* ──────── Module 3: Business Overview ──────── */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              双轮驱动业务全景
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-16 rounded-full" />
          </RevealSection>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Edu */}
            <RevealSection>
              <div>
                <h3 className="text-xl font-bold text-[#1565C0] mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#1565C0] rounded-full inline-block" />
                  智教服务集群
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
                        了解更多 &rarr;
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
                  产融生态矩阵
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
                        了解更多 &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ──────── Module 4: Highlights ──────── */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              核心亮点
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-16 rounded-full" />
          </RevealSection>

          <div className="flex flex-col gap-16">
            {highlights.map((item: HighlightItem, i: number) => (
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

      {/* ──────── Module 5: Partners Wall ──────── */}
      <section className="bg-[#F5F7FA] py-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 mb-10">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              合作伙伴
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

      {/* ──────── Module 6: News Preview ──────── */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A3C8A] mb-4">
              新闻动态
            </h2>
            <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-16 rounded-full" />
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((news: { id: string; title: string; excerpt: string; date: string; category: string }) => (
              <RevealSection key={news.title}>
                <article className="bg-[#F5F7FA] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  {/* Thumbnail placeholder */}
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
                  <div className="p-6">
                    <time className="text-xs text-gray-400 mb-2 block">
                      {news.date}
                    </time>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#1A3C8A] transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {news.excerpt}
                    </p>
                  </div>
                </article>
              </RevealSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/news"
              className="inline-block px-8 py-3 rounded-full border-2 border-[#1A3C8A] text-[#1A3C8A] font-medium hover:bg-[#1A3C8A] hover:text-white transition-colors duration-300"
            >
              查看更多 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── Module 7: CTA Section ──────── */}
      <section className="bg-gradient-to-br from-[#0f2557] to-[#1A3C8A] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left slogan */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                AI赋能千行万业
              </h2>
              <p className="text-xl text-[#D4A843]">国企担当引领未来</p>
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
              立即咨询
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
