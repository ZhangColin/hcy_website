"use client";

import { useState } from "react";

interface QrCodeImageProps {
  url: string | null;
  label: string;
}

export function QrCodeImage({ url, label }: QrCodeImageProps) {
  const [imageError, setImageError] = useState(false);
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

  // No URL configured - show placeholder
  if (!url) {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
        <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    );
  }

  // URL configured but image failed to load - show placeholder
  if (imageError) {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
        <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    );
  }

  // Show image
  const imageUrl = url.startsWith('http') ? url : `${imageBaseUrl}${url}`;

  return (
    <div className="relative h-24 w-24">
      <img
        src={imageUrl}
        alt={`${label}二维码`}
        className="h-24 w-24 rounded-lg object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
