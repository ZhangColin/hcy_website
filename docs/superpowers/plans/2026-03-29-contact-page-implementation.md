# 联系我们页面增强实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 增强联系页面，实现前后台数据一致，支持完整地址信息管理和分业务联系人头像展示

**架构:**
- SiteConfig 存储公司通用信息（地址、电话、邮箱、地图坐标）
- ContactInfo.contacts Json 存储分业务联系人（含头像 URL）
- 前端从两个数据源组合展示完整信息

**技术栈:** Next.js 15, Prisma, PostgreSQL, 高德地图 WebJS API, 腾讯云 COS

---

## 文件结构

```
prisma/
  schema.prisma                           # 修改：SiteConfig 添加字段
src/
  app/
    api/
      admin/[collection]/route.ts         # 修改：site whitelist 添加字段
      upload/route.ts                     # 修改：contacts 添加到允许目录
    admin/page.tsx                        # 修改：SiteEditor 和 ContactEditor
    contact/page.tsx                      # 修改：加载 site 数据
  components/
    ContactPageClient.tsx                 # 修改：显示地址信息和联系人卡片
    AMap.tsx                              # 新建：高德地图组件
  lib/
    data.ts                               # 修改：loadContact 类型更新
```

---

## Task 1: 更新上传接口支持联系人头像

**Files:**
- Modify: `src/app/api/upload/route.ts:11`

- [ ] **Step 1: 添加 "contacts" 到允许的目录列表**

```typescript
// 将第 11 行修改为：
const ALLOWED_TYPES_DIRS = ['highlights', 'news', 'hero', 'partners', 'honors', 'uploads', 'contacts'];
```

- [ ] **Step 2: 验证修改**

检查文件确保 "contacts" 已添加到数组中

- [ ] **Step 3: 提交**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: add contacts to allowed upload directories"
```

---

## Task 2: 数据库 Schema 更新

**Files:**
- Modify: `prisma/schema.prisma:111-122`

- [ ] **Step 1: 修改 SiteConfig 模型添加新字段**

```prisma
// 将 SiteConfig 模型修改为：
model SiteConfig {
  id            String @id @default(cuid())
  companyName   String
  shortName     String
  address       String
  phone         String?
  email         String?
  mapLng        String?
  mapLat        String?
  icp           String
  copyright     String
  friendlyLinks Json
  socialLinks   Json
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

- [ ] **Step 2: 生成 Prisma 迁移**

```bash
npx prisma migrate dev --name add_site_contact_fields
```

预期输出：迁移文件生成成功，数据库表结构更新

- [ ] **Step 3: 提交**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add phone/email/map coordinates to SiteConfig"
```

---

## Task 3: 更新 API Whitelist

**Files:**
- Modify: `src/app/api/admin/[collection]/route.ts:15`

- [ ] **Step 1: 添加新字段到 site whitelist**

```typescript
// 将第 15 行修改为：
site: ["companyName", "shortName", "address", "phone", "email", "mapLng", "mapLat", "icp", "copyright", "friendlyLinks", "socialLinks"],
```

- [ ] **Step 2: 验证修改**

确保新字段 phone, email, mapLng, mapLat 已添加

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/[collection]/route.ts
git commit -m "feat: add contact fields to site API whitelist"
```

---

## Task 4: 后台 SiteEditor 添加新字段

**Files:**
- Modify: `src/app/admin/page.tsx:456-495`

- [ ] **Step 1: 修改 SiteEditor 组件添加新字段**

找到 SiteEditor 函数，在基本信息 SectionCard 中添加新字段：

```tsx
// 在 FieldEditor label="公司地址" 之后添加：
<FieldEditor label="联系电话" value={(data.phone as string) ?? ""} onChange={(v) => setData({ ...data, phone: v })} />
<FieldEditor label="电子邮箱" value={(data.email as string) ?? ""} onChange={(v) => setData({ ...data, email: v })} />
<FieldEditor label="地图经度" value={(data.mapLng as string) ?? ""} onChange={(v) => setData({ ...data, mapLng: v })} placeholder="如：116.397428" />
<FieldEditor label="地图纬度" value={(data.mapLat as string) ?? ""} onChange={(v) => setData({ ...data, mapLat: v })} placeholder="如：39.90923" />
```

- [ ] **Step 2: 验证修改**

确保新字段添加在正确位置（基本信息 SectionCard 内）

- [ ] **Step 3: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add phone/email/map fields to SiteEditor"
```

---

## Task 5: 后台 ContactEditor 简化并添加头像上传

**Files:**
- Modify: `src/app/admin/page.tsx:419-452`

- [ ] **Step 1: 修改 ContactEditor 移除地址编辑**

找到 ContactEditor 函数，删除地址信息的 SectionCard：

```tsx
// 删除整个地址信息 SectionCard：
// <SectionCard title="地址信息">...</SectionCard>
```

- [ ] **Step 2: 修改联系人列表添加头像字段**

找到 createItem，添加 avatar 字段：

```tsx
// 将 createItem 修改为：
createItem={() => ({ department: "", person: "", phone: "", email: "", avatar: "" })}
```

- [ ] **Step 3: 在 renderItem 中添加头像上传**

找到 renderItem 函数，在字段编辑部分添加 ImageButton：

```tsx
// 在现有的 grid 布局后添加：
<ImageButton
  label="头像"
  value={(item.avatar as string) || ""}
  onChange={(v) => update("avatar", v)}
  type="contacts"
/>
```

完整的 renderItem 应该是：

```tsx
renderItem={(item, _i, update) => (
  <>
    <ImageButton
      label="头像"
      value={(item.avatar as string) || ""}
      onChange={(v) => update("avatar", v)}
      type="contacts"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FieldEditor label="部门" value={item.department} onChange={(v) => update("department", v)} />
      <FieldEditor label="联系人" value={item.person} onChange={(v) => update("person", v)} />
      <FieldEditor label="电话" value={item.phone} onChange={(v) => update("phone", v)} />
      <FieldEditor label="邮箱" value={item.email} onChange={(v) => update("email", v)} />
    </div>
  </>
)}
```

- [ ] **Step 4: 验证修改**

确保地址编辑已移除，头像上传已添加

- [ ] **Step 5: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: simplify ContactEditor and add avatar upload"
```

---

## Task 6: 更新前端数据加载

**Files:**
- Modify: `src/app/contact/page.tsx:7-11`
- Modify: `src/lib/data.ts:86-99`

- [ ] **Step 1: 修改 contact/page.tsx 加载 site 数据**

```tsx
// 将文件内容修改为：
import { loadData } from "@/lib/data";
import ContactPageClient from "@/components/ContactPageClient";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const [contactData, siteData] = await Promise.all([
    loadData("contact"),
    loadData("site")
  ]);

  return <ContactPageClient contactData={contactData} siteData={siteData} />;
}
```

- [ ] **Step 2: 更新 loadContact 返回类型**

```typescript
// 保持 loadContact 函数不变，但确保返回的 contacts 包含所有字段
```

- [ ] **Step 3: 验证修改**

确保 contactData 和 siteData 都传递给 ContactPageClient

- [ ] **Step 4: 提交**

```bash
git add src/app/contact/page.tsx src/lib/data.ts
git commit -m "feat: load site data for contact page"
```

---

## Task 7: 创建高德地图组件

**Files:**
- Create: `src/components/AMap.tsx`

- [ ] **Step 1: 创建 AMap 组件**

```tsx
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
      // 使用高德地图 WebJS API，这里使用测试 key
      script.src = "https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY";
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
```

- [ ] **Step 2: 验证文件创建**

```bash
cat src/components/AMap.tsx
```

预期输出：文件内容正确

- [ ] **Step 3: 提交**

```bash
git add src/components/AMap.tsx
git commit -m "feat: add AMap component for location display"
```

---

## Task 8: 更新 ContactPageClient 显示地址和地图

**Files:**
- Modify: `src/components/ContactPageClient.tsx:6-11`

- [ ] **Step 1: 更新组件 props 和类型**

```tsx
// 修改 ContactData 接口和添加 SiteData：
interface ContactData {
  address: string;
  contacts: { department: string; person: string; phone: string; email: string; avatar?: string }[];
}

interface SiteData {
  address: string;
  phone?: string;
  email?: string;
  mapLng?: string;
  mapLat?: string;
}

// 修改组件函数签名：
export default function ContactPageClient({ contactData, siteData }: { contactData: ContactData; siteData: SiteData }) {
```

- [ ] **Step 2: 修改地址区域显示动态数据**

找到地址区域的 SectionCard（约第 204-268 行），修改地址、电话、邮箱的显示：

```tsx
// 地址信息修改为从 siteData 读取：
<p className="text-[#666666] leading-relaxed">
  {siteData.address || data.address}
</p>

// 电话修改为：
<p className="text-[#666666]">{siteData.phone || "暂无电话"}</p>

// 邮箱修改为：
<p className="text-[#666666]">{siteData.email || "暂无邮箱"}</p>
```

- [ ] **Step 3: 替换地图占位符为 AMap 组件**

找到地图占位符区域（约第 256-265 行），替换为：

```tsx
// 地图区域
{(siteData.mapLng && siteData.mapLat) ? (
  <AMap
    lng={siteData.mapLng}
    lat={siteData.mapLat}
    address={siteData.address}
    className="min-h-[320px]"
  />
) : (
  <div className="rounded-2xl bg-gradient-to-br from-[#1A3C8A]/5 to-[#2B6CB0]/10 border-2 border-dashed border-[#1A3C8A]/20 flex flex-col items-center justify-center min-h-[320px]">
    <svg className="w-16 h-16 text-[#1A3C8A]/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
      <path d="M9 2L3 5v17l6-3 6 3 6-3V2l-6 3-6-3z" />
      <path d="M9 2v17" />
      <path d="M15 5v17" />
    </svg>
    <span className="text-[#1A3C8A]/50 font-medium text-lg">地图未配置</span>
    <span className="text-[#666666]/50 text-sm mt-1">请在后台设置地图坐标</span>
  </div>
)}
```

确保文件顶部导入 AMap：

```tsx
import { AMap } from "@/components/AMap";
```

- [ ] **Step 4: 验证修改**

确保地址、电话、邮箱从 siteData 读取，地图组件正确集成

- [ ] **Step 5: 提交**

```bash
git add src/components/ContactPageClient.tsx
git commit -m "feat: display address info from site config and integrate AMap"
```

---

## Task 9: 更新联系人卡片显示头像、电话、邮箱

**Files:**
- Modify: `src/components/ContactPageClient.tsx:278-310`

- [ ] **Step 1: 修改联系人卡片布局**

找到联系人卡片渲染部分（约第 278-310 行），修改为：

```tsx
{contactData.contacts.map((c) => {
  const style = contactStyles[c.department] || defaultStyle;
  const hasAvatar = c.avatar && c.avatar.length > 0;

  return (
    <div
      key={c.department}
      className="group rounded-2xl bg-[#F5F7FA] hover:bg-white hover:shadow-lg transition-all duration-300 p-6 border border-transparent hover:border-gray-100 text-center"
    >
      {/* 头像 */}
      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-to-br from-[#1A3C8A]/10 to-[#2B6CB0]/10 flex items-center justify-center">
        {hasAvatar ? (
          <img
            src={c.avatar!.startsWith('http') ? c.avatar! : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${c.avatar!}`}
            alt={c.person}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>

      {/* 部门名称 */}
      <h3 className="font-bold text-[#333333] text-lg mb-2 leading-snug">
        {c.department}
      </h3>

      {/* 联系人姓名 */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-[#1A3C8A] font-semibold">{c.person}</span>
      </div>

      {/* 电话 */}
      {c.phone && c.phone.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600 mb-1">
          <svg className="w-3.5 h-3.5 text-[#D4A843]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span>{c.phone}</span>
        </div>
      )}

      {/* 邮箱 */}
      {c.email && c.email.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
          <svg className="w-3.5 h-3.5 text-[#D4A843]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
          <span className="truncate max-w-[150px]" title={c.email}>{c.email}</span>
        </div>
      )}
    </div>
  );
})}
```

- [ ] **Step 2: 验证修改**

确保卡片布局正确，头像、电话、邮箱按条件显示

- [ ] **Step 3: 提交**

```bash
git add src/components/ContactPageClient.tsx
git commit -m "feat: display avatar/phone/email in contact cards"
```

---

## Task 10: 手动初始化地图坐标

**Files:**
- No file changes

- [ ] **Step 1: 获取公司地址的经纬度**

访问高德地图坐标拾取工具：https://lbs.amap.com/tools/picker

搜索公司地址，获取经纬度

- [ ] **Step 2: 在后台更新地图坐标**

1. 访问后台管理页面 /admin
2. 进入"站点设置"
3. 填入经纬度（mapLng/mapLat）
4. 保存

---

## Task 11: 测试验收

**Files:**
- No file changes

- [ ] **Step 1: 后台测试**

1. 访问 /admin，登录
2. 进入"站点设置"，验证可编辑：电话、邮箱、地图经度、地图纬度
3. 进入"联系方式"，验证可上传联系人头像
4. 保存数据

- [ ] **Step 2: 前端测试**

1. 访问 /contact
2. 验证地址区域显示从数据库读取的电话和邮箱
3. 验证高德地图正确显示公司位置
4. 验证联系人卡片显示头像、电话、邮箱

- [ ] **Step 3: 边界情况测试**

1. 未配置地图坐标时，显示"地图未配置"占位符
2. 联系人无头像时，显示默认图标
3. 联系人无电话/邮箱时，不显示对应行

- [ ] **Step 4: 验收确认**

- [ ] 后台"站点设置"可编辑公司电话、邮箱、地图坐标
- [ ] 后台"联系方式"可上传联系人头像
- [ ] 前端地址区域显示从数据库读取的电话和邮箱
- [ ] 前端显示正确的高德地图位置
- [ ] 前端联系人卡片显示头像、电话、邮箱

---

## 验收标准

- [ ] 后台"站点设置"可编辑公司电话、邮箱、地图坐标
- [ ] 后台"联系方式"可上传联系人头像
- [ ] 前端地址区域显示从数据库读取的电话和邮箱
- [ ] 前端显示正确的高德地图位置
- [ ] 前端联系人卡片显示头像、电话、邮箱
