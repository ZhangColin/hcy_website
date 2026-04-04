# Footer 与社交媒体配置设计设计文档

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
- SiteConfig schema 中字段是 `socialLinks`，但 admin 页面错误地使用了 `data.social`（这是一个 bug）
- src/lib/data.ts 中使用的是 `loadSite()` 函数
- 图片上传 API 在 `/api/upload/route.ts`，使用腾讯云 COS

---

## 数据结构

### Prisma Schema（当前状态）

```prisma
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
  friendlyLinks Json   // 当前: [{ label: string, href: string }]
  socialLinks   Json   // 当前: 可能是对象格式 { weibo: "", douyin: "", bilibili: "" }
  // 新增字段:
  wechatOfficialQr String?  // 微信公众号二维码 URL
  wechatServiceQr   String?  // 微信客服二维码 URL
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**重要**: 当前 admin 页面使用 `data.social` 是错误的，正确字段名是 `socialLinks`。这次实现将修正这个问题。

### 类型定义

```typescript
// 友情链接
interface FriendlyLink {
  label: string;
  href: string;
}

// 社交媒体链接（目标格式）
interface SocialLink {
  platform: 'weibo' | 'douyin' | 'bilibili' | 'xiaohongshu' | 'zhihu' | 'weixin';
  url: string;
}
```

---

## 后台界面修改

### 站点设置页面 (SiteEditor)

#### 1. 修正字段名

将 `data.social` 改为 `data.socialLinks`，修正当前的 bug。

#### 2. 微信二维码区块

- **微信公众号二维码**: 图片上传组件
- **微信客服二维码**: 图片上传组件

图片上传使用腾讯云 COS，类型为 `qrcode`，最终路径格式：`https://image.website.aieducenter.com/qrcode/filename.jpg`

图片规格：建议 200x200px，正方形

#### 3. 社交媒体区块

从对象格式改为数组列表编辑：

**平台选项及中文名称：**
| 值 | 中文名称 | 说明 |
|---|---------|------|
| weibo | 微博 | 社交媒体平台 |
| douyin | 抖音 | 短视频平台 |
| bilibili | 哔哩哔哩 | 视频平台 |
| xiaohongshu | 小红书 | 社交电商平台 |
| zhihu | 知乎 | 问答社区 |
| weixin | 微信视频号 | 视频号平台（区别于公众号二维码） |

**列表项包含：**
- 平台选择（下拉框）
- 链接输入（文本框）
- 上移/下移按钮（调整顺序）
- 删除按钮

---

## 前台 Footer 修改

### 数据获取

Footer 组件通过 `loadSite()` 获取站点配置数据。

### 渲染逻辑

1. **Sitemap 导航区**: 保持硬编码
2. **公司信息区**: 从配置读取 `companyName`、`address`、`icp`、`copyright`
   - ICP 备案号链接到 `beian.miit.gov.cn`
3. **友情链接区**: 遍历 `friendlyLinks` 数组，所有链接 `target="_blank"`
4. **微信二维码区**:
   - 有 URL: 显示图片（200x200px），alt="微信公众号二维码" / "微信客服二维码"
   - 无 URL: 显示当前占位图标（灰色背景 + 轮廓图标）
   - 下方始终显示标签"微信公众号"、"微信客服"
   - 图片加载失败时，回退到占位图标
5. **社交媒体区**: 遍历 `socialLinks` 数组渲染图标链接
   - 每个链接有 `aria-label` 属性
   - 图标根据 platform 渲染对应 SVG

### 图标组件

在 Footer.tsx 中内联定义 SVG 图标组件。参考当前 Footer 中已有的图标风格（简单的品牌 logo 路径）。

**已有图标**（复用）: Weibo, Douyin, Bilibili
**需要新增**（从 Simple Icons 或类似库获取 SVG 路径）:
- Xiaohongshu: https://simpleicons.org/icons/xiaohongshu
- Zhihu: https://simpleicons.org/icons/zhihu
- Weixin: https://simpleicons.org/icons/weixin

---

## API 变更

### GET /api/admin/site

添加数据格式迁移逻辑：如果 `socialLinks` 是对象格式，自动转换为数组格式。

```typescript
// 返回前检查并转换
if (siteData.socialLinks && typeof siteData.socialLinks === 'object' && !Array.isArray(siteData.socialLinks)) {
  // 从 { weibo: "url" } 转换为 [{ platform: "weibo", url: "url" }]
  siteData.socialLinks = Object.entries(siteData.socialLinks).map(([platform, url]) => ({ platform, url }));
}
```

### PUT /api/admin/[collection]/route.ts

`FIELD_WHITELISTS.site` 添加：`wechatOfficialQr`、`wechatServiceQr`

### POST /api/upload/route.ts

`ALLOWED_TYPES_DIRS` 添加 `'qrcode'`

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `prisma/schema.prisma` | 修改 | 添加 `wechatOfficialQr`、`wechatServiceQr` 字段 |
| `src/app/api/upload/route.ts` | 修改 | `ALLOWED_TYPES_DIRS` 添加 `'qrcode'` |
| `src/app/api/admin/[collection]/route.ts` | 修改 | 添加 `socialLinks` 格式迁移逻辑，更新 whitelist |
| `src/app/admin/page.tsx` | 修改 | `social` → `socialLinks`，添加二维码上传和社交媒体列表 |
| `src/components/Footer.tsx` | 修改 | 从配置读取数据，新增社交媒体图标 |
| `prisma/migrations/` | 新增 | 数据库迁移文件 |

---

## 数据迁移策略

采用运行时转换策略：
1. GET 返回时检测 `socialLinks` 格式
2. 如果是对象格式，转换为数组格式
3. PUT 保存时，已经是数组格式，直接保存
4. 第一次保存后，数据库中的数据就永久更新为新格式

---

## 测试计划

1. 后台上传微信二维码，保存成功
2. 后台添加/删除/排序社交媒体，保存成功
3. 前台 Footer 正确显示所有配置数据
4. 社交媒体图标正确渲染
5. 二维码未配置时显示占位图标
6. 二维码图片加载失败时回退到占位图标
7. ICP 备案号链接正确
8. 友情链接在新标签页打开
