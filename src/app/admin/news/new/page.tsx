import { NewsEditorClient } from '@/components/NewsEditorClient';
import { ToastProvider } from '@/components/Toast';

export const dynamic = 'force-dynamic';

export default function NewNewsPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <NewsEditorClient />
      </div>
    </ToastProvider>
  );
}
