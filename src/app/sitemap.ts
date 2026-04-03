import { MetadataRoute } from 'next';
import { generateSitemap } from '@/lib/sitemap-generator';

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemap();
}
