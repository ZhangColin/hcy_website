import { Metadata } from 'next';
import CasesClient from './CasesClient';

export const metadata: Metadata = {
  title: '学校案例 - 海创元AI教育',
  description: '海创元AI教育合作院校案例展示，涵盖小学、初中、高中全学段，服务北京、上海、浙江等地区130+所学校。',
  keywords: '海创元案例,AI教育学校案例,AI课程入校案例,人工智能教育合作',
  openGraph: {
    title: '学校案例 - 海创元AI教育',
    description: '海创元AI教育合作院校案例展示，服务130+所学校',
  },
};

export const revalidate = 86400; // 每天重新生成

export default function CasesPage() {
  return <CasesClient />;
}
