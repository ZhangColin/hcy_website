import { Metadata } from 'next';
import TeacherTrainingClient from './TeacherTrainingClient';

export const metadata: Metadata = {
  title: 'AI师资培训与等级认证 - 海创元AI教育',
  description: '双轨培训体系+工信部国家级等级认证，打造培训—认证—持证上岗闭环，提升教师AI教学能力。',
  keywords: 'AI师资培训,AI教师认证,人工智能师资培训,教师AI能力提升',
  openGraph: {
    title: 'AI师资培训与等级认证 - 海创元AI教育',
    description: '双轨培训体系+国家级等级认证',
  },
};

export const revalidate = 86400;

export default function TeacherTrainingPage() {
  return <TeacherTrainingClient />;
}
