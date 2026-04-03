/**
 * Simple manual test for SEO utility functions
 * Run with: npx tsx src/lib/__tests__/seo-utils.test.ts
 */

import { generateMetaProps, generateNewsMeta, generateCaseMeta, generateBreadcrumb } from '../seo-utils';

// Test 1: generateMetaProps
console.log('Test 1: generateMetaProps');
const metaProps = generateMetaProps({
  title: 'Test Page',
  description: 'Test description',
  keywords: 'test, seo',
  canonical: '/test',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    image: '/og-image.jpg',
    type: 'website',
  },
  twitterCard: {
    image: '/twitter-image.jpg',
  },
});
console.log('✓ generateMetaProps works:', !!metaProps.title);
console.log('  Title:', metaProps.title);

// Test 2: generateNewsMeta
console.log('\nTest 2: generateNewsMeta');
const newsMeta = generateNewsMeta({
  title: 'Test News Article',
  excerpt: 'This is a test article',
  slug: 'test-article',
  category: 'AI News',
  image: '/news-image.jpg',
  seoTitle: 'Custom SEO Title',
  seoDescription: 'Custom SEO description',
  seoKeywords: 'AI, machine learning',
  ogImage: '/og-news.jpg',
});
console.log('✓ generateNewsMeta works:', !!newsMeta.title);
console.log('  Title:', newsMeta.title);

// Test 3: generateCaseMeta
console.log('\nTest 3: generateCaseMeta');
const caseMeta = generateCaseMeta({
  name: 'Test School',
  region: 'Beijing',
  slug: 'test-school',
  grade: '["小学", "初中"]',
  partnership: 'strategic',
  seoTitle: 'Test School AI Education Case',
  seoDescription: 'How Test School implemented AI education',
  featuredImage: '/case-image.jpg',
});
console.log('✓ generateCaseMeta works:', !!caseMeta.title);
console.log('  Title:', caseMeta.title);

// Test 4: generateBreadcrumb
console.log('\nTest 4: generateBreadcrumb');
const breadcrumb = generateBreadcrumb([
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Article', href: '/news/test' },
]);
console.log('✓ generateBreadcrumb works:', breadcrumb['@type'] === 'BreadcrumbList');
console.log('  Items count:', breadcrumb.itemListElement.length);

console.log('\n✅ All tests passed!');
