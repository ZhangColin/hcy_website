# Footer 与社交媒体配置设计文档

**日期:** 2026-03-29
**目标:** 让 Footer 组件使用站点配置数据，支持微信二维码上传和社交媒体动态管理

---

## 背景

当前 Footer 组件的内容是硬编码的，公司信息、友情链接、社交媒体等数据无法通过后台管理。需要：
1. Footer 使用 SiteConfig 中的数据
2. 支持上传微信公众号和客服二维码
3. 社交媒体支持动态添加、删除、排序

**当前状态分析：**
- Footer.tsx 硬编码了公司信息、友情链接、sitemap 导航
- SiteConfig 已有 `socialLinks` 字段，但后台使用的是 `social` 字段存储对象格式 `{ weibo, douyin, bilibili }`
- src/lib/data.ts 中使用的是 `loadSite()` 函数
- 图片上传 API 在 `/api/upload/route.ts`，`ALLOWED_TYPES_DIRS` 需要添加新类型

---

## 数据结构变更

### Prisma Schema

```prisma
model SiteConfig {
  id                 String   @id @default(cuid())
  companyName        String
  shortName          String
  address            String
  phone              String?
  email              String?
  mapLng             String?
  mapLat             String?
  icp                String
  copyright          String
  friendlyLinks      Json     // [{ label: string, href: string }]
  socialLinks        Json     // [{ platform: string, url: string }]
  wechatOfficialQr   String?  // 微信公众号二维码 URL
  wechatServiceQr    String?  // 微信客服二维码 URL
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

### SocialLink 类型定义

```typescript
interface SocialLink {
  platform: 'weibo' | 'douyin' | 'bilibili' | 'xiaohongshu' | 'zhihu' | 'weixin';
  url: string;
}
```

**注意**: `socialLinks` 从对象格式改为数组格式是**破坏性变更**。

### FriendlyLink 类型定义

```typescript
interface FriendlyLink {
  label: string;
  href: string;
}
```

**注意**: 移除 `external` 属性，所有友情链接统一作为外部链接处理（添加 `target="_blank"`）。

---

## 后台界面修改

### 站点设置页面 (SiteEditor)

#### 1. 微信二维码区块

- **微信公众号二维码**: 图片上传组件
- **微信客服二维码**: 图片上传组件

使用现有的图片上传机制，需要在 `src/app/api/upload/route.ts` 的 `ALLOWED_TYPES_DIRS` 中添加 `'qrcode'` 类型。

上传目录：`qrcode/`

图片规格：建议 200x200px，正方形

#### 2. 社交媒体区块

**字段名称变更**: 从 `social` 改为 `socialLinks`，与数据库字段保持一致。

动态列表，每项包含：
- **平台选择**: 下拉框，选项：
  - 微博 (weibo) - 社交媒体平台
  - 抖音 (douyin) - 社交媒体平台
  - 哔哩哔哩 (bilibili) - 社交媒体平台
  - 小红书 (xiaohongshu) - 社交媒体平台
  - 知乎 (zhihu) - 社交媒体平台
  - 微信视频号 (weixin) - 视频平台（区别于二维码）
- **链接输入**: 文本输入框
- **操作**: 上移、下移、删除按钮
- **添加按钮**: 添加新的社交媒体项

**数据格式**: `socialLinks: [{ platform: 'weibo', url: 'https://...' }]`

---

## 前台 Footer 修改

### 数据获取

Footer 组件通过 `loadSite()` 获取站点配置数据。

### 渲染逻辑

1. **Sitemap 导航区**: 保持硬编码（不涉及配置）
2. **公司信息区**: 从配置读取 `companyName`、`address`、`icp`、`copyright`
   - ICP 备案号保持链接到 `beian.miit.gov.cn` 的行为
3. **友情链接区**: 遍历 `friendlyLinks` 数组渲染，所有链接添加 `target="_blank"`
4. **微信二维码区**:
   - 如果 `wechatOfficialQr` 有值，显示图片（200x200px），alt="微信公众号二维码"
   - 如果无值，显示占位图标（保持当前行为）
   - 下方始终显示标签"微信公众号"、"微信客服"
5. **社交媒体区**: 遍历 `socialLinks` 数组，根据 platform 渲染对应 SVG 图标
   - 每个图标链接添加 `aria-label` 属性，值为平台中文名称

### 图标组件

在 Footer 组件内定义各平台的 SVG 图标组件。SVG 路径参考：
- WeiboIcon（复用现有）
- DouyinIcon（复用现有）
- BilibiliIcon（复用现有）
- XiaohongshuIcon（使用标准小红书图标 SVG）
- ZhihuIcon（使用标准知乎图标 SVG）
- WeixinIcon（使用标准微信图标 SVG）

---

## API 变更

### GET /api/admin/site

返回 site 配置时包含新增字段 `wechatOfficialQr`、`wechatServiceQr`。

**数据迁移逻辑位置**: 在 GET 返回前，检测 `socialLinks` 格式：
- 如果是对象格式 `{ weibo: "url" }`，自动转换为数组格式 `[{ platform: "weibo", url: "url" }]`

### PUT /api/admin/[collection]/route.ts

更新 `FIELD_WHITELISTS.site` 数组，添加：
- `wechatOfficialQr`
- `wechatServiceQr`
- `socialLinks`（已存在，但格式从对象改为数组）

### POST /api/upload/route.ts

在 `ALLOWED_TYPES_DIRS` 中添加 `'qrcode'` 类型。

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `prisma/schema.prisma` | 修改 | 添加 `wechatOfficialQr`、`wechatServiceQr` 字段 |
| `src/app/api/upload/route.ts` | 修改 | `ALLOWED_TYPES_DIRS` 添加 `'qrcode'` |
| `src/app/api/admin/[collection]/route.ts` | 修改 | `FIELD_WHITELISTS.site` 添加新字段，GET 添加数据迁移逻辑 |
| `src/app/admin/page.tsx` | 修改 | SiteEditor：`social` 改为 `socialLinks`，添加微信二维码上传和社交媒体列表编辑 |
| `src/components/Footer.tsx` | 修改 | 从配置读取数据渲染，添加新图标组件，移除 `external` 属性判断 |
| `src/lib/data.ts` | 检查 | 确认 `loadSite()` 函数正常工作 |
| `prisma/migrations/` | 新增 | 数据库迁移文件 |

---

## 数据迁移

当前 `socialLinks` 字段可能存储的是对象格式：
```json
{ "weibo": "https://...", "douyin": "https://..." }
```

需要迁移为数组格式：
```json
[{ "platform": "weibo", "url": "https://..." }, { "platform": "douyin", "url": "https://..." }]
```

**迁移实现位置**: `src/app/api/admin/[collection]/route.ts` 的 GET 处理器中，返回数据前进行格式检测和转换。

---

## 测试计划

1. 后台上传微信二维码，保存成功，前台正确显示（200x200px，带 alt 文本）
2. 后台添加/删除/排序社交媒体，保存成功
3. 前台 Footer 正确显示所有配置数据
4. 社交媒体图标正确渲染（包括新增的小红书、知乎、微信视频号）
5. 当二维码未配置时，显示占位图标和标签
6. ICP 备案号链接正确跳转到 beian.miit.gov.cn
7. 友情链接正确在新标签页打开
8. 社交媒体链接具有正确的 aria-label
