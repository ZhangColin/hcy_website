// src/components/AMap.tsx
"use client";

import { useEffect, useRef } from "react";

interface AMapProps {
  lng: string;
  lat: string;
  address?: string;
  companyName?: string;
  className?: string;
}

export function AMap({ lng, lat, address, companyName = "海创源科技中心", className = "" }: AMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 添加自定义样式，去除标签背景框
    const style = document.createElement('style');
    style.innerHTML = `
      .amap-marker-label {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: #333 !important;
        font-size: 14px !important;
        font-weight: bold !important;
        text-shadow: 1px 1px 2px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9) !important;
        padding: 4px 8px !important;
      }
    `;
    document.head.appendChild(style);

    // 动态加载高德地图脚本
    const loadScript = () => {
      if (window.AMap) return; // 已加载

      const script = document.createElement("script");
      // 使用环境变量中的高德地图 key
      const amapKey = process.env.NEXT_PUBLIC_AMAP_KEY || "";
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;
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

      // 添加标记，带标签
      const marker = new window.AMap.Marker({
        position: [parseFloat(lng), parseFloat(lat)],
        title: address || "公司地址",
        label: {
          content: companyName,
          direction: "top",
          offset: new window.AMap.Pixel(0, 5),
        },
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
      // 清理样式
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [lng, lat, address, companyName]);

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
