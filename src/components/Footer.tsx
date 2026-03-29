import Link from "next/link";
import { loadSite } from "@/lib/data";

const sitemapColumns = [
  {
    title: "关于海创元",
    links: [
      { label: "公司简介", href: "/about#intro" },
      { label: "发展历程", href: "/about#timeline" },
      { label: "荣誉资质", href: "/about#honors" },
      { label: "合作伙伴", href: "/about#partners" },
    ],
  },
  {
    title: "智教服务集群",
    links: [
      { label: "AI课程入校", href: "/services/ai-curriculum" },
      { label: "AI师资培训", href: "/services/teacher-training" },
      { label: "AI研学", href: "/services/ai-research-study" },
      { label: "生态产品联盟", href: "/services/ecosystem-alliance" },
    ],
  },
  {
    title: "产融生态矩阵",
    links: [
      { label: "政企AI赋能培训", href: "/ecosystem/enterprise-training" },
      { label: "OPC生态", href: "/ecosystem/opc" },
      { label: "智创专项服务", href: "/ecosystem/smart-services" },
      { label: "不良资产盘活", href: "/ecosystem/asset-revitalization" },
    ],
  },
  {
    title: "案例与成果",
    links: [
      { label: "服务院校案例", href: "/cases#schools" },
      { label: "赛事荣誉", href: "/cases#honors" },
      { label: "业务覆盖版图", href: "/cases#coverage" },
    ],
  },
  {
    title: "新闻动态",
    links: [
      { label: "公司新闻", href: "/news?category=company" },
      { label: "行业资讯", href: "/news?category=industry" },
      { label: "媒体报道", href: "/news?category=media" },
    ],
  },
];

export default async function Footer() {
  // 获取站点配置，如果失败则使用默认值
  let site;
  try {
    site = await loadSite();
  } catch (error) {
    console.error('Failed to load site config:', error);
    // 使用默认值避免页面崩溃
    site = {
      companyName: "北京海创元人工智能教育科技有限公司",
      address: "北京市海淀区中关村大街1号",
      icp: "京ICP备XXXXXXXX号-X",
      copyright: "北京海创元人工智能教育科技有限公司",
      friendlyLinks: [],
      socialLinks: [],
      wechatOfficialQr: null,
      wechatServiceQr: null,
    };
  }
  const friendlyLinks = (site.friendlyLinks as Array<{ label: string; href: string }>) ?? [];
  const socialLinks = (site.socialLinks as Array<{ platform: string; url: string }>) ?? [];
  return (
    <footer className="bg-[#0F2557] text-white/80">
      {/* Row 1: Sitemap */}
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {sitemapColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-base font-semibold text-white">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Friendly Links */}
        <div className="mt-10 flex flex-wrap items-center gap-x-1 border-t border-white/10 pt-6 text-sm text-white/50">
          <span className="mr-2 text-white/70">友情链接：</span>
          {friendlyLinks.map((link, index) => (
            <span key={link.href} className="flex items-center">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
              {index < friendlyLinks.length - 1 && (
                <span className="mx-2">|</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: Company info + Row 3: QR codes & social */}
      <div className="border-t border-white/10 bg-[#0A1B3F]">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Company information */}
            <div className="space-y-2 text-sm text-white/50">
              <p className="text-base font-medium text-white/80">
                北京海创元人工智能教育科技有限公司
              </p>
              <p>地址：北京市海淀区中关村大街1号</p>
              <p>
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  京ICP备XXXXXXXX号-X
                </a>
              </p>
              <p>
                Copyright &copy; {new Date().getFullYear()}{" "}
                北京海创元人工智能教育科技有限公司 版权所有
              </p>
            </div>

            {/* QR codes & social media */}
            <div className="flex flex-shrink-0 items-start gap-8">
              {/* WeChat Official Account QR */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
                  <svg
                    className="h-10 w-10 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l9 6 9-6"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/50">微信公众号</span>
              </div>

              {/* WeChat Customer Service QR */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
                  <svg
                    className="h-10 w-10 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/50">微信客服</span>
              </div>

              {/* Social media links */}
              <div className="flex flex-col gap-3 pt-1">
                <span className="text-xs font-medium text-white/60">
                  关注我们
                </span>
                <div className="flex gap-3">
                  {/* Weibo */}
                  <a
                    href="#"
                    aria-label="微博"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM20.196 11.84c-.247-.636-.887-.936-1.467-.728-.233.084-.42.24-.549.43-.079.12-.126.252-.162.383-.134.505-.604.862-1.133.862-.152 0-.296-.037-.438-.094-.482-.188-.77-.674-.685-1.169.043-.247.17-.461.35-.625.364-.334.58-.816.58-1.337 0-1.005-.818-1.823-1.824-1.823-.357 0-.688.107-.967.285-.559.36-.929.985-.929 1.69 0 .233.045.452.118.663.147.424.038.895-.287 1.192-.196.18-.449.281-.713.3-.082.007-.163.009-.244.009-2.94 0-5.321 2.38-5.321 5.318 0 2.938 2.381 5.318 5.321 5.318 2.938 0 5.317-2.38 5.317-5.318 0-.357-.036-.706-.104-1.045a1.025 1.025 0 01.063-.56c.072-.162.19-.296.34-.383.602-.35.985-1 .985-1.727 0-.247-.048-.483-.131-.703z" />
                    </svg>
                  </a>
                  {/* Douyin / TikTok */}
                  <a
                    href="#"
                    aria-label="抖音"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13a8.28 8.28 0 005.58 2.17v-3.44a4.85 4.85 0 01-1-.1v-.01a4.83 4.83 0 001-4.93z" />
                    </svg>
                  </a>
                  {/* Bilibili */}
                  <a
                    href="#"
                    aria-label="哔哩哔哩"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.186l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
