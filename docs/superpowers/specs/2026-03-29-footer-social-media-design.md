# Footer 与社交媒体配置设计文档

**日期:** 2026-03-29
**目标:** 让 Footer 组件使用站点配置数据，支持微信二维码上传和社交媒体动态管理

---

## 背景

当前 Footer 组件的内容是硬编码的，公司信息、友情链接、社交媒体等数据无法通过后台管理。需要：
1. Footer 使用 SiteConfig 中的数据
2. 支持上传微信公众号和客服二维码
3. 社交媒体支持动态添加、删除、排序

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

---

## 后台界面修改

### 站点设置页面 (SiteEditor)

新增两个编辑区块：

#### 1. 微信二维码区块

- **微信公众号二维码**: 图片上传组件
- **微信客服二维码**: 图片上传组件

使用现有的图片上传机制（复用新闻编辑器的图片上传组件）。

#### 2. 社交媒体区块

动态列表，每项包含：
- **平台选择**: 下拉框，选项：微博、抖音、哔哩哔哩、小红书、知乎、微信视频号
- **链接输入**: 文本输入框
- **操作**: 上移、下移、删除按钮
- **添加按钮**: 添加新的社交媒体项

---

## 前台 Footer 修改

### 数据获取

Footer 组件通过 `getSiteConfig()` 获取站点配置数据。

### 渲染逻辑

1. **公司信息区**: 显示 `companyName`、`address`、`icp`、`copyright`
2. **友情链接区**: 遍历 `friendlyLinks` 数组渲染
3. **微信二维码区**: 显示 `wechatOfficialQr`、`wechatServiceQr` 图片
4. **社交媒体区**: 遍历 `socialLinks` 数组，根据 platform 渲染对应 SVG 图标

### 图标映射

```typescript
const SOCIAL_ICONS: Record<string, JSX.Element> = {
  weibo: <WeiboIcon />,
  douyin: <DouyinIcon />,
  bilibili: <BilibiliIcon />,
  xiaohongshu: <XiaohongshuIcon />,
  zhihu: <ZhihuIcon />,
  weixin: <WeixinIcon />,
};
```

---

## API 变更

### GET /api/admin/site

返回 site 配置时包含新增字段。

### PUT /api/admin/[collection]/route.ts

更新 `FIELD_WHITELISTS.site` 数组，添加 `wechatOfficialQr`、`wechatServiceQr`。

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `prisma/schema.prisma` | 修改 | 添加微信二维码字段 |
| `src/app/admin/page.tsx` | 修改 | SiteEditor 添加微信二维码上传和社交媒体列表编辑 |
| `src/components/Footer.tsx` | 修改 | 从配置读取数据渲染 |
| `src/lib/data.ts` | 检查 | 确认 getSiteConfig 函数 |
| `prisma/migrations/` | 新增 | 数据库迁移文件 |

---

## 测试计划

1. 后台上传微信二维码，保存成功
2. 后台添加/删除/排序社交媒体，保存成功
3. 前台 Footer 正确显示所有配置数据
4. 社交媒体图标正确渲染
