import Link from "next/link";
import { loadSite } from "@/lib/data";
import FooterInner from "./FooterInner";

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
  // Handle both old object format and new array format for friendlyLinks
  let friendlyLinks: Array<{ label: string; href: string }>;
  if (Array.isArray(site.friendlyLinks)) {
    friendlyLinks = site.friendlyLinks as Array<{ label: string; href: string }>;
  } else {
    friendlyLinks = [];
  }

  // Handle both old object format { weibo: "", douyin: "" } and new array format [{ platform: "weibo", url: "" }]
  let socialLinks: Array<{ platform: string; url: string }>;
  if (Array.isArray(site.socialLinks)) {
    socialLinks = site.socialLinks as Array<{ platform: string; url: string }>;
  } else if (site.socialLinks && typeof site.socialLinks === 'object' && !Array.isArray(site.socialLinks)) {
    // Convert old object format to new array format
    const oldFormat = site.socialLinks as Record<string, string>;
    socialLinks = Object.entries(oldFormat)
      .filter(([_, url]) => url && url.trim() !== '')
      .map(([platform, url]) => ({ platform, url }));
  } else {
    socialLinks = [];
  }

  return <FooterInner site={site} friendlyLinks={friendlyLinks} socialLinks={socialLinks} />;
}
