import { TwitterCardProps } from '@/types/seo';

export function TwitterCard({
  card = 'summary_large_image',
  title,
  description,
  image,
}: TwitterCardProps) {
  return (
    <>
      <meta name="twitter:card" content={card} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
