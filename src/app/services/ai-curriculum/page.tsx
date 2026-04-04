import { Metadata } from 'next';
import AICurriculumClient from './AICurriculumClient';

export const metadata: Metadata = {
  title: 'AI课程入校 - 海创元AI教育',
  description: '1+N综合解决方案，覆盖小/初/高全学段，5年课堂实践打磨，累计服务130+所院校。',
  keywords: 'AI课程入校,人工智能课程,AI教学体系,中小学AI教育',
  openGraph: {
    title: 'AI课程入校 - 海创元AI教育',
    description: '1+N综合解决方案，覆盖全学段',
  },
};

export const revalidate = 86400; // 每天重新生成

export default function AICurriculumPage() {
  return <AICurriculumClient />;
}