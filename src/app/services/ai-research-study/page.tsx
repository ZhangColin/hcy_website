import { Metadata } from 'next';
import AIResearchStudyClient from './AIResearchStudyClient';

export const metadata: Metadata = {
  title: 'AI研学 - 海创元AI教育',
  description: '多层次、多场景研学服务体系，覆盖学校、企业、高层次领导力及低龄群体。',
  keywords: 'AI研学,人工智能研学,AI教育研学,科技研学活动',
  openGraph: {
    title: 'AI研学 - 海创元AI教育',
    description: '多层次、多场景研学服务体系',
  },
};

export const revalidate = 86400;

export default function AIResearchStudyPage() {
  return <AIResearchStudyClient />;
}
