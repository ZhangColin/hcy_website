import { loadData } from "@/lib/data";
import HomePageContent from "@/components/HomePageContent";

export const revalidate = 1800; // 每30分钟重新生成

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';


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
    image: slide.image || undefined,
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

  return (
    <HomePageContent
      heroSlides={heroSlides}
      dataStrip={dataStrip}
      highlights={highlights}
      partners={partners}
      newsItems={newsItems}
    />
  );
}
