"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SubItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: SubItem[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  { label: "关于海创元", href: "/about" },
  {
    label: "智教服务集群",
    href: "/services",
    children: [
      {
        label: "AI课程入校",
        href: "/services/ai-curriculum",
        description: "将前沿AI课程体系引入校园，赋能基础教育与高等教育",
      },
      {
        label: "AI师资培训与认证",
        href: "/services/teacher-training",
        description: "面向教师的AI能力提升培训及专业资质认证",
      },
      {
        label: "AI研学",
        href: "/services/ai-research-study",
        description: "沉浸式AI主题研学旅行与实践项目",
      },
      {
        label: "生态产品联盟",
        href: "/services/ecosystem-alliance",
        description: "联合优质AI教育产品，构建开放生态",
      },
    ],
  },
  {
    label: "产融生态矩阵",
    href: "/ecosystem",
    children: [
      {
        label: "政企AI赋能培训",
        href: "/ecosystem/enterprise-training",
        description: "为政府与企业定制AI转型培训方案",
      },
      {
        label: "OPC生态",
        href: "/ecosystem/opc",
        description: "开放产业合作平台，连接教育与产业资源",
      },
      {
        label: "智创专项服务",
        href: "/ecosystem/smart-services",
        description: "AI技术咨询与定制化智能解决方案",
      },
      {
        label: "不良资产盘活",
        href: "/ecosystem/asset-revitalization",
        description: "以AI技术赋能资产价值重塑与运营优化",
      },
    ],
  },
  { label: "案例与成果", href: "/cases" },
  { label: "新闻动态", href: "/news" },
  { label: "联系我们", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  );
}

function HamburgerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function CloseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function ArrowUpIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}

function ChatIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mega Menu Dropdown                                                 */
/* ------------------------------------------------------------------ */

function MegaMenu({
  items,
  isOpen,
}: {
  items: SubItem[];
  isOpen: boolean;
}) {
  return (
    <div
      className={`
        absolute top-full left-1/2 -translate-x-1/2 pt-4
        transition-all duration-200 ease-out
        ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
    >
      <div className="w-[560px] rounded-xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-[#1A3C8A]/[0.03]"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-[#1A3C8A] transition-colors">
                {item.label}
                <ArrowRightIcon className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </span>
              {item.description && (
                <span className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Nav Drawer                                                  */
/* ------------------------------------------------------------------ */

function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full w-[min(85vw,360px)]
          bg-white shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-bold text-[#1A3C8A]">
            海创元AI教育
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="关闭菜单"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          expandedItem === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        expandedItem === item.label
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="ml-3 border-l-2 border-[#1A3C8A]/10 pl-3 pb-2 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:text-[#1A3C8A] hover:bg-[#1A3C8A]/[0.03] transition-colors"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <Link
            href="/consultation"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#1A3C8A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15306E] transition-colors"
          >
            <ChatIcon className="w-4 h-4" />
            在线咨询
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <button className="font-medium text-[#1A3C8A]">中</button>
            <span>/</span>
            <button className="text-gray-500 hover:text-[#1A3C8A] transition-colors">
              EN
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Header Component                                                   */
/* ------------------------------------------------------------------ */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ---- Scroll listener ---- */
  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 20);
    setShowBackToTop(y > window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ---- Lock body scroll when mobile nav is open ---- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ---- Focus search input when opened ---- */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  /* ---- Dropdown handlers ---- */
  const openDropdown = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const closeDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  /* ---- Scroll to top ---- */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ============================================================= */}
      {/*  HEADER                                                        */}
      {/* ============================================================= */}
      <header
        className={`
          fixed top-0 inset-x-0 z-30 transition-all duration-300
          ${
            scrolled
              ? "header-scrolled h-16 bg-white/90 backdrop-blur-lg shadow-sm"
              : "h-20 bg-white"
          }
        `}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ---- Logo ---- */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
          >
            {/* Abstract logo mark */}
            <div
              className={`
                flex items-center justify-center rounded-lg bg-[#1A3C8A] text-white font-black
                transition-all duration-300
                ${scrolled ? "w-8 h-8 text-sm" : "w-9 h-9 text-base"}
              `}
            >
              H
            </div>
            <span
              className={`
                font-bold text-[#1A3C8A] whitespace-nowrap transition-all duration-300
                ${scrolled ? "text-lg" : "text-xl"}
              `}
            >
              海创元
              <span className="text-gray-400 font-normal ml-0.5">AI教育</span>
            </span>
          </Link>

          {/* ---- Desktop Navigation ---- */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const hasChildren = !!item.children;
              const isActive = activeDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && openDropdown(item.label)}
                  onMouseLeave={() => hasChildren && closeDropdown()}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium
                      transition-colors duration-150
                      ${
                        isActive
                          ? "text-[#1A3C8A] bg-[#1A3C8A]/[0.06]"
                          : "text-gray-700 hover:text-[#1A3C8A] hover:bg-[#1A3C8A]/[0.03]"
                      }
                    `}
                  >
                    {item.label}
                    {hasChildren && (
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {hasChildren && item.children && (
                    <MegaMenu items={item.children} isOpen={isActive} />
                  )}
                </div>
              );
            })}
          </nav>

          {/* ---- Right Actions ---- */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="搜索..."
                    className="w-48 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/20 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="关闭搜索"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-gray-500 hover:text-[#1A3C8A] hover:bg-[#1A3C8A]/[0.06] transition-colors"
                  aria-label="搜索"
                >
                  <SearchIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Language toggle */}
            <div className="hidden md:flex items-center rounded-lg border border-gray-200 overflow-hidden text-xs">
              <button
                onClick={() => setLang("zh")}
                className={`px-2.5 py-1.5 font-medium transition-colors ${
                  lang === "zh"
                    ? "bg-[#1A3C8A] text-white"
                    : "text-gray-500 hover:text-[#1A3C8A]"
                }`}
              >
                中
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 font-medium transition-colors ${
                  lang === "en"
                    ? "bg-[#1A3C8A] text-white"
                    : "text-gray-500 hover:text-[#1A3C8A]"
                }`}
              >
                EN
              </button>
            </div>

            {/* CTA Button */}
            <Link
              href="/consultation"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A3C8A] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#15306E] hover:shadow-md active:scale-[0.97] transition-all duration-150"
            >
              <ChatIcon className="w-4 h-4" />
              <span className="hidden sm:inline">在线咨询</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -mr-2 rounded-lg text-gray-600 hover:text-[#1A3C8A] hover:bg-gray-100 transition-colors"
              aria-label="打开菜单"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to offset fixed header */}
      <div className={`transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`} />

      {/* ============================================================= */}
      {/*  MOBILE NAV                                                    */}
      {/* ============================================================= */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* ============================================================= */}
      {/*  BACK TO TOP                                                   */}
      {/* ============================================================= */}
      <button
        onClick={scrollToTop}
        aria-label="返回顶部"
        className={`
          fixed bottom-24 right-6 z-20
          flex items-center justify-center w-11 h-11
          rounded-full bg-white text-[#1A3C8A] shadow-lg ring-1 ring-black/5
          hover:bg-[#1A3C8A] hover:text-white hover:shadow-xl
          active:scale-95 transition-all duration-300
          ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >
        <ArrowUpIcon />
      </button>

      {/* ============================================================= */}
      {/*  FLOATING CONSULTATION BUTTON                                  */}
      {/* ============================================================= */}
      <Link
        href="/consultation"
        aria-label="在线咨询"
        className="
          fixed bottom-8 right-6 z-20
          flex items-center justify-center w-14 h-14
          rounded-full bg-[#1A3C8A] text-white shadow-lg
          hover:bg-[#15306E] hover:shadow-xl hover:scale-105
          active:scale-95 transition-all duration-200
          ring-4 ring-[#1A3C8A]/20
        "
      >
        <ChatIcon />
      </Link>
    </>
  );
}
