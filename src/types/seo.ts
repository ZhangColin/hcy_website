// SEO 相关类型定义

export interface OpenGraphProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
}

export interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image?: string;
}

export interface JsonLdProps {
  type: 'Organization' | 'Article' | 'BreadcrumbList';
  data: Record<string, any>;
}

export interface MetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: OpenGraphProps;
  twitterCard?: TwitterCardProps;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}
