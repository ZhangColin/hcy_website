'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '@/types/seo';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="面包屑导航">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link href={item.href} className="hover:text-blue-600 transition-colors">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
