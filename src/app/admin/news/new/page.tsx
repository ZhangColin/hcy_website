import { NewsEditorClient } from '@/components/NewsEditorClient';

export const dynamic = 'force-dynamic';

export default function NewNewsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NewsEditorClient />
    </div>
  );
}
