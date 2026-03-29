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

  function renderQrCode(url: string | null, label: string) {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

    if (url) {
      const imageUrl = url.startsWith('http') ? url : `${imageBaseUrl}${url}`;
      return (
        <div className="relative h-24 w-24">
          <img
            src={imageUrl}
            alt={`${label}二维码`}
            className="h-24 w-24 rounded-lg object-cover"
            onError={(e) => {
              // 图片加载失败时隐藏图片，显示占位符
              e.currentTarget.classList.add('hidden');
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.classList.remove('hidden');
            }}
          />
          <div className="hidden absolute inset-0 flex items-center justify-center rounded-lg bg-white/10">
            <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        </div>
      );
    }
    // 无配置时显示占位图标
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
        <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    );
  }
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
                {site.companyName}
              </p>
              <p>地址：{site.address}</p>
              <p>
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {site.icp}
                </a>
              </p>
              <p>
                Copyright &copy; {new Date().getFullYear()} {site.copyright}
              </p>
            </div>

            {/* QR codes & social media */}
            <div className="flex flex-shrink-0 items-start gap-8">
              {/* WeChat Official Account QR */}
              <div className="flex flex-col items-center gap-2">
                {renderQrCode(site.wechatOfficialQr as string | null, "微信公众号")}
                <span className="text-xs text-white/50">微信公众号</span>
              </div>

              {/* WeChat Customer Service QR */}
              <div className="flex flex-col items-center gap-2">
                {renderQrCode(site.wechatServiceQr as string | null, "微信客服")}
                <span className="text-xs text-white/50">微信客服</span>
              </div>

              {/* Social media links - will be updated in next task */}
              <div className="flex flex-col gap-3 pt-1">
                <span className="text-xs font-medium text-white/60">
                  关注我们
                </span>
                <div className="flex gap-3">
                  {/* Placeholder - will be replaced in next task */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
