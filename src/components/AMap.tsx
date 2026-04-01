// src/components/AMap.tsx
"use client";

import { useEffect, useRef } from "react";

interface AMapProps {
  lng: string;
  lat: string;
  address?: string;
  className?: string;
}

export function AMap({ lng, lat, address, className = "" }: AMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 动态加载高德地图脚本
    const loadScript = () => {
      if (window.AMap) return; // 已加载

      const script = document.createElement("script");
      // 使用环境变量中的高德地图 key 和 jscode
      const amapKey = process.env.NEXT_PUBLIC_AMAP_KEY || "";
      const amapJsCode = process.env.NEXT_PUBLIC_AMAP_JS_CODE || "";
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&jscode=${amapJsCode}`;
      script.onerror = () => {
        console.error("高德地图加载失败，请检查 API Key 是否配置正确");
      };
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.AMap) return;

      // 创建地图实例
      const map = new window.AMap.Map(mapRef.current, {
        zoom: 15,
        center: [parseFloat(lng), parseFloat(lat)],
        viewMode: "3D",
      });

      // 添加标记
      const marker = new window.AMap.Marker({
        position: [parseFloat(lng), parseFloat(lat)],
        title: address || "公司地址",
      });

      map.add(marker);
      mapInstanceRef.current = map;
    };

    // 延迟加载，避免 SSR 问题
    const timer = setTimeout(() => {
      loadScript();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [lng, lat, address]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full min-h-[320px] rounded-2xl ${className}`}
      style={{ backgroundColor: "#f0f0f0" }}
    />
  );
}

// 声明 AMap 全局类型
declare global {
  interface Window {
    AMap?: any;
  }
}
