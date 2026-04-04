import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: '服务体系 - 海创元AI教育',
  description: '海创元AI教育提供AI课程入校、AI师资培训、AI研学、政企培训等全方位服务，赋能人工智能教育生态。',
  keywords: '海创元服务,AI课程入校,AI师资培训,AI研学,政企AI培训',
  openGraph: {
    title: '服务体系 - 海创元AI教育',
    description: '全方位AI教育服务体系',
  },
};

export const revalidate = 86400;

export default function ServicesPage() {
  return <ServicesClient />;
}
