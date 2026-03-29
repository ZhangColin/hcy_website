import Link from "next/link";
import { loadSite } from "@/lib/data";

// Social media icon components
function WeiboIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM20.196 11.84c-.247-.636-.887-.936-1.467-.728-.233.084-.42.24-.549.43-.079.12-.126.252-.162.383-.134.505-.604.862-1.133.862-.152 0-.296-.037-.438-.094-.482-.188-.77-.674-.685-1.169.043-.247.17-.461.35-.625.364-.334.58-.816.58-1.337 0-1.005-.818-1.823-1.824-1.823-.357 0-.688.107-.967.285-.559.36-.929.985-.929 1.69 0 .233.045.452.118.663.147.424.038.895-.287 1.192-.196.18-.449.281-.713.3-.082.007-.163.009-.244.009-2.94 0-5.321 2.38-5.321 5.318 0 2.938 2.381 5.318 5.321 5.318 2.938 0 5.317-2.38 5.317-5.318 0-.357-.036-.706-.104-1.045a1.025 1.025 0 01.063-.56c.072-.162.19-.296.34-.383.602-.35.985-1 .985-1.727 0-.247-.048-.483-.131-.703z" />
    </svg>
  );
}

function DouyinIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13a8.28 8.28 0 005.58 2.17v-3.44a4.85 4.85 0 01-1-.1v-.01a4.83 4.83 0 001-4.93z" />
    </svg>
  );
}

function BilibiliIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.186l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  );
}

function XiaohongshuIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 6.678c-2.655.182-5.346.826-5.934 1.774-.144.229-.23.483-.23.743 0 1.774 2.746 3.348 6.147 3.348 3.4 0 6.147-1.574 6.147-3.348 0-.26-.086-.514-.23-.743-.588-.948-3.279-1.592-5.934-1.774h.034zm6.373 1.774c0 .13-.022.258-.055.383-.248 1.573-2.767 2.811-5.844 2.811-3.076 0-5.595-1.238-5.843-2.81a2.146 2.146 0 01-.056-.384c0-1.774 2.747-3.348 6.148-3.348 3.4 0 6.148 1.574 6.148 3.348h-.298zm-1.07 5.724c-.358.244-.775.389-1.22.409-.483.02-.976-.15-1.368-.484-.392-.334-.683-.795-.825-1.314-.142-.52-.128-1.07.04-1.568.168-.497.473-.92.876-1.213.403-.293.877-.44 1.36-.413.483.028.94.226 1.31.568.37.342.633.81.752 1.325.12.514.09 1.053-.085 1.545-.175.492-.483.915-.886 1.208l.346.074zm-2.334-2.08c-.117.088-.266.122-.408.093-.142-.03-.26-.115-.328-.238-.068-.124-.08-.27-.033-.403.047-.133.14-.243.26-.31.12-.066.258-.083.387-.046.13.037.24.118.31.228.07.11.095.24.07.366a.476.476 0 01-.258.31zm4.233 1.003a2.614 2.614 0 01-1.31-.568c-.37-.342-.633-.81-.752-1.325-.12-.514-.09-1.053.085-1.545.175-.492.483-.915.886-1.208l-.346-.074c.358-.244.775-.389 1.22-.409.483-.02.976.15 1.368.484.392.334.683.795.825 1.314.142.52.128 1.07-.04 1.568-.168.497-.473.92-.876 1.213-.403.293-.877.44-1.36.413-.483-.028-.94-.226-1.31-.568l.31-.495z"/>
    </svg>
  );
}

function ZhihuIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.025 0H6.975C3.123 0 0 3.123 0 6.975v10.05C0 20.877 3.123 24 6.975 24h10.05C20.877 24 24 20.877 24 17.025V6.975C24 3.123 20.877 0 17.025 0zM7.682 19.518l-1.656-3.527H4.2v3.527H2.622v-8.34h3.19c1.6 0 2.586.965 2.586 2.425 0 1.18-.67 2.008-1.653 2.3l1.828 3.615H7.682zm6.585-5.726v-2.614h-1.58v2.614h1.58zm1.614 0v-2.614h1.578v2.614h-1.578zm-4.81 0v-2.614H9.5v2.614h1.572zm-1.572 1.577H9.5v2.453c0 .658.275.873.806.873.298 0 .615-.073.89-.18v1.374c-.34.126-.744.197-1.184.197-1.286 0-2.043-.682-2.043-1.96v-2.757zm3.196 3.656v-5.233h1.578v.733c.325-.535.82-.838 1.47-.838.275 0 .517.037.722.11v1.503c-.22-.09-.476-.127-.775-.127-.65 0-1.11.43-1.11 1.32v2.532h-1.885zm4.528 0v-5.233h1.578v.733c.324-.535.82-.838 1.47-.838.274 0 .516.037.722.11v1.503c-.22-.09-.476-.127-.776-.127-.65 0-1.11.43-1.11 1.32v2.532h-1.884zm-10.48-7.076H5.812c-.695 0-1.13-.41-1.13-1.12 0-.71.435-1.12 1.13-1.12h1.432v2.24zm10.48-1.275v-1.25h-1.578v1.25h1.578z"/>
    </svg>
  );
}

function WeixinIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
    </svg>
  );
}

// Icon and platform name mappings
const SOCIAL_ICONS: Record<string, JSX.Element> = {
  weibo: <WeiboIcon />,
  douyin: <DouyinIcon />,
  bilibili: <BilibiliIcon />,
  xiaohongshu: <XiaohongshuIcon />,
  zhihu: <ZhihuIcon />,
  weixin: <WeixinIcon />,
};

const PLATFORM_NAMES: Record<string, string> = {
  weibo: "微博",
  douyin: "抖音",
  bilibili: "哔哩哔哩",
  xiaohongshu: "小红书",
  zhihu: "知乎",
  weixin: "微信视频号",
};

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

              {/* Social media links */}
              <div className="flex flex-col gap-3 pt-1">
                <span className="text-xs font-medium text-white/60">
                  关注我们
                </span>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={PLATFORM_NAMES[link.platform] || link.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                    >
                      {SOCIAL_ICONS[link.platform] || null}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
