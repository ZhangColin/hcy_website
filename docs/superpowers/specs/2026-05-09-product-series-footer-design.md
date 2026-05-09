# 海创元系列产品 — 页脚展示区块

## 概述

在页脚友情链接上方新增"海创元系列产品"展示区块，后台支持维护 logo、名称、链接，展示风格为半透明卡片横排。

## 数据模型

存储在 `SiteConfig` 表中，新增 `productSeries` 字段（Json 类型）：

```typescript
interface ProductSeriesItem {
  name: string;   // 产品名称
  logo?: string;  // 产品 logo（COS 路径）
  href: string;   // 产品链接
}
```

## 页脚展示

位置：sitemap 区块下方、友情链接上方，用分隔线隔开。

布局：
- 标题"海创元系列产品"居中，下方带金色装饰线
- 产品卡片横排居中排列，半透明背景 + 细边框
- 每个卡片：logo（圆角方形背景） + 产品名称
- 卡片可点击跳转（新标签页打开）
- 深蓝背景（#0F2557）上，与页脚色调协调

## 后台管理

在 admin 页面"友情链接"区块上方新增"海创元系列产品"区块：
- 复用现有 ListEditor 组件
- 每条数据包含：名称、链接、logo（通过 ImageButton 上传）
- COS 上传类型新增 "products" 到白名单

## 涉及文件

- `prisma/schema.prisma` — SiteConfig 新增 productSeries 字段
- `src/components/FooterInner.tsx` — 新增系列产品展示区块
- `src/components/Footer.tsx` — 传递 productSeries 数据
- `src/app/admin/page.tsx` — 新增系列产品管理区块
- `src/lib/cos.ts` — 上传白名单新增 "products"
- `src/app/api/admin/[collection]/route.ts` — SiteConfig 字段白名单新增 productSeries
- 国际化文件 — 新增翻译 key
- 数据库迁移
