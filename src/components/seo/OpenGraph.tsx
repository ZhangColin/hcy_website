import { OpenGraphProps } from '@/types/seo';

export function OpenGraph({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = '海创元AI教育',
  locale = 'zh_CN',
}: OpenGraphProps) {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
    </>
  );
}
