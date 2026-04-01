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
      if (window.AMap) {
        console.log("[AMap] 脚本已加载，直接初始化地图");
        initMap();
        return;
      }

      const script = document.createElement("script");
      // 使用环境变量中的高德地图 key
      const amapKey = process.env.NEXT_PUBLIC_AMAP_KEY || "";
      console.log("[AMap] 开始加载高德地图脚本，API Key:", amapKey ? "已配置" : "未配置");
      console.log("[AMap] 完整 API Key:", amapKey);
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;
      script.onerror = () => {
        console.error("[AMap] 高德地图加载失败，请检查 API Key 是否配置正确");
      };
      script.onload = () => {
        console.log("[AMap] 高德地图脚本加载成功");
        setTimeout(() => {
          console.log("[AMap] window.AMap 可用:", typeof window.AMap);
          initMap();
        }, 100);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      console.log("[AMap] initMap 被调用");
      console.log("[AMap] mapRef.current:", mapRef.current ? "存在" : "不存在");
      console.log("[AMap] window.AMap:", typeof window.AMap);
      console.log("[AMap] 传入的坐标值 - lng:", lng, "lat:", lat);
      console.log("[AMap] 解析后的坐标 - 经度:", parseFloat(lng), "纬度:", parseFloat(lat));
      console.log("[AMap] 地图中心点将设置为:", `[${parseFloat(lng)}, ${parseFloat(lat)}]`);
      console.log("[AMap] 地址:", address);

      if (!mapRef.current || !window.AMap) {
        console.error("[AMap] 初始化失败：", !mapRef.current ? "mapRef 不存在" : "window.AMap 不存在");
        return;
      }

      // 创建地图实例
      const map = new window.AMap.Map(mapRef.current, {
        zoom: 15,
        center: [parseFloat(lng), parseFloat(lat)],
        viewMode: "3D",
      });

      console.log("[AMap] 地图实例已创建，中心点:", map.getCenter());

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
