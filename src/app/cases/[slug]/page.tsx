import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateCaseMeta } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';
import { JsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 86400; // 每天重新生成

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseItem = await prisma.schoolCase.findUnique({
    where: { slug },
  });

  if (!caseItem) return {};

  return generateCaseMeta({
    name: caseItem.name,
    region: caseItem.region,
    slug: caseItem.slug!,
    grade: caseItem.grade,
    partnership: caseItem.partnership,
    seoTitle: caseItem.seoTitle,
    seoDescription: caseItem.seoDescription,
    featuredImage: caseItem.featuredImage,
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseItem = await prisma.schoolCase.findUnique({
    where: { slug },
  });

  if (!caseItem) {
    notFound();
  }

  const jsonLdData = {
    headline: `${caseItem.name} AI教育合作案例`,
    description: caseItem.partnership,
    image: caseItem.featuredImage || caseItem.coverImage,
  };

  // Parse grade array
  const grades = JSON.parse(caseItem.grade || '[]');

  return (
    <>
      <JsonLd type="Article" data={jsonLdData} />
      <div className="min-h-screen bg-[#F5F7FA] py-12">
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#1A3C8A] transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                首页
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/cases" className="text-gray-400 hover:text-[#1A3C8A] transition-colors">案例与成果</Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[#1A3C8A] font-semibold">{caseItem.name}</span>
            </nav>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#1A3C8A]/10 text-[#1A3C8A] text-sm font-medium rounded-full">
                {caseItem.region}
              </span>
              {grades.length > 0 && grades.map((grade: string) => (
                <span key={grade} className="px-3 py-1 bg-blue-50 text-[#2B6CB0] text-sm font-medium rounded-full">
                  {grade}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              {caseItem.name}
            </h1>

            {caseItem.schoolLogo && (
              <div className="mb-6 relative h-16 w-32">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${caseItem.schoolLogo}`}
                  alt={`${caseItem.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {(caseItem.coverImage || caseItem.featuredImage) && (
              <div className="mb-6 rounded-xl overflow-hidden relative h-64 w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${caseItem.featuredImage || caseItem.coverImage}`}
                  alt={caseItem.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Partnership */}
          {caseItem.partnership && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">合作内容</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {caseItem.partnership}
              </p>
            </div>
          )}

          {/* Results */}
          {caseItem.results && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">合作成果</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {caseItem.results}
              </p>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3C8A] text-white font-medium rounded-lg hover:bg-[#2B6CB0] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回案例列表
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
