"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ─── Types ─── */
interface HeroSlide {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image?: string;
}

interface PartnerItem {
  name: string;
  logo?: string;
}

interface DataStripItem {
  label: string;
  value: number;
  suffix: string;
}

/* ─── Icon Mapping ─── */
const iconMap: Record<string, string> = {
  "覆盖省市": "map",
  "服务院校": "school",
  "合作渠道": "network",
  "全球总冠军": "trophy",
  "全国总冠军": "medal",
  "累计授课": "clock",
};

/* ─── SVG Icons ─── */
function DataIcon({ type }: { type: string }) {
  const cls = "w-8 h-8 text-[#D4A843]";
  switch (type) {
    case "map":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M9 2L3 5v17l6-3 6 3 6-3V2l-6 3-6-3z" />
        </svg>
      );
    case "school":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M2 10l10-5 10 5-10 5-10-5z" />
          <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
          <path d="M22 10v6" />
        </svg>
      );
    case "network":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M12 7v4m-5 6l5-6m5 6l-5-6" />
        </svg>
      );
    case "trophy":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M6 2h12v6a6 6 0 01-12 0V2z" />
          <path d="M6 4H3v2a3 3 0 003 3" />
          <path d="M18 4h3v2a3 3 0 01-3 3" />
          <path d="M12 14v4" />
          <path d="M8 22h8" />
          <path d="M10 18h4" />
        </svg>
      );
    case "medal":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="14" r="6" />
          <path d="M8 2l2 8M16 2l-2 8" />
          <path d="M12 11l1.5 1.5L12 17l-1.5-4.5z" fill="currentColor" />
        </svg>
      );
    case "clock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Animated Counter Hook ─── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

/* ─── Counter Cell ─── */
function CounterCell({
  item,
  inView,
}: {
  item: DataStripItem & { icon: string };
  inView: boolean;
}) {
  const count = useCounter(item.value, 2000, inView);
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-6 min-w-[140px]">
      <DataIcon type={item.icon} />
      <span className="text-3xl font-bold text-[#1A3C8A] flex items-center">
        {count}
        <span className="text-lg font-normal text-[#D4A843]">{item.suffix}</span>
      </span>
      <span className="text-sm text-gray-600">{item.label}</span>
    </div>
  );
}

/* ─── Section Reveal Wrapper ─── */
export function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/* ─── Helper to check if URL is external ─── */
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/* ─── Hero Carousel ─── */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goToSlide = (i: number) => {
    setCurrentSlide(i);
    resetTimer();
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, i) => {
        const isExternal = isExternalUrl(slide.href);
        const LinkComponent = isExternal ? 'a' : Link;
        const linkProps = isExternal
          ? { href: slide.href, target: '_blank', rel: 'noopener noreferrer' as const }
          : { href: slide.href };
        const bgImage = slide.image
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${slide.image}`
          : undefined;

        return (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background image or gradient */}
            {bgImage ? (
              <>
                <img
                  src={bgImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
              </>
            ) : (
              <div className="absolute inset-0 hero-gradient" />
            )}

            {/* Content */}
            <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-[#D4A843] mb-10 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              <LinkComponent
                {...linkProps}
                className="inline-block px-8 py-3 rounded-full border-2 border-[#D4A843] text-[#D4A843] font-medium hover:bg-[#D4A843] hover:text-white transition-colors duration-300 text-lg"
              >
                {slide.cta}
              </LinkComponent>
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-[#D4A843] w-8"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Counter Strip ─── */
export function CounterStrip({ items }: { items: DataStripItem[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripInView, setStripInView] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStripInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const itemsWithIcons = items.map((item) => ({
    ...item,
    icon: iconMap[item.label] || "clock",
  }));

  return (
    <section ref={stripRef} className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {itemsWithIcons.map((item) => (
            <CounterCell key={item.icon} item={item} inView={stripInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Partners Wall ─── */
export function PartnersWall({ partners }: { partners: Array<string | PartnerItem> }) {
  // Normalize to PartnerItem array
  const normalizedPartners = partners.map((p) =>
    typeof p === "string" ? { name: p, logo: "" } : p
  );

  return (
    <div className="animate-scroll flex w-max">
      {[...normalizedPartners, ...normalizedPartners].map((partner, i) => {
        const logoUrl = partner.logo
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${partner.logo}`
          : undefined;

        return (
          <div
            key={i}
            className="flex items-center gap-3 mx-6 px-6 py-4 bg-white rounded-xl shadow-sm min-w-[180px] h-20"
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt={partner.name}
                className="w-10 h-10 object-contain flex-shrink-0"
              />
            )}
            <span className="text-base font-bold text-[#1A3C8A]/80 whitespace-nowrap">
              {partner.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
