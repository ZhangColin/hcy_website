import { Metadata } from 'next';
import EcosystemAllianceClient from './EcosystemAllianceClient';

export const metadata: Metadata = {
  title: '生态产品联盟 - 海创元AI教育',
  description: '联合行业优质伙伴，构建AI教育生态系统，提供全方位AI教育解决方案。',
  keywords: 'AI教育联盟,人工智能生态,AI教育合作伙伴,教育科技联盟',
  openGraph: {
    title: '生态产品联盟 - 海创元AI教育',
    description: '构建AI教育生态系统',
  },
};

export const revalidate = 86400;

export default function EcosystemAlliancePage() {
  return <EcosystemAllianceClient />;
}
