# Footer 与社交媒体配置实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 让 Footer 组件使用站点配置数据，支持微信二维码上传和社交媒体动态管理

**架构:**
1. 数据库层面：添加微信二维码字段到 SiteConfig
2. API 层面：允许二维码上传，社交媒体数据格式迁移
3. 后台界面：修正 socialLinks 字段名 bug，添加二维码上传和社交媒体列表编辑
4. 前台组件：Footer 从配置读取数据渲染

**技术栈:** Next.js App Router, Prisma, PostgreSQL, React, TypeScript

---

## Task 1: 更新 Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: 添加微信二维码字段到 SiteConfig**

在 `SiteConfig` 模型中，`socialLinks` 字段之后添加两个新字段：

```prisma
wechatOfficialQr String?  // 微信公众号二维码 URL
wechatServiceQr   String?  // 微信客服二维码 URL
```

- [ ] **Step 2: 生成 Prisma 客户端**

Run: `npx prisma generate`
Expected: 输出显示 "Generated Prisma Client" 成功

- [ ] **Step 3: 推送数据库变更**

Run: `npx prisma db push`
Expected: 数据库同步成功，显示 "Your database is now in sync with your schema"

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add WeChat QR code fields to SiteConfig"
```

---

## Task 2: 更新图片上传 API

**Files:**
- Modify: `src/app/api/upload/route.ts`

- [ ] **Step 1: 添加 qrcode 到允许类型列表**

在第 11 行，修改 `ALLOWED_TYPES_DIRS` 数组，添加 `'qrcode'`：

```typescript
const ALLOWED_TYPES_DIRS = ['highlights', 'news', 'hero', 'partners', 'honors', 'uploads', 'contacts', 'qrcode'];
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: add qrcode type to image upload API"
```

---

## Task 3: 更新 Admin API 路由

**Files:**
- Modify: `src/app/api/admin/[collection]/route.ts`

- [ ] **Step 1: 更新 site 字段白名单**

在第 15 行，修改 `FIELD_WHITELISTS.site` 数组，添加新字段：

```typescript
site: ["companyName", "shortName", "address", "phone", "email", "mapLng", "mapLat", "icp", "copyright", "friendlyLinks", "socialLinks", "wechatOfficialQr", "wechatServiceQr"],
```

- [ ] **Step 2: 添加 socialLinks 数据迁移逻辑**

在第 74 行 `return NextResponse.json(data);` 之前，添加迁移逻辑：

```typescript
// socialLinks 数据格式迁移：对象转数组
if (collection === "site" && data && typeof data === "object") {
  const siteData = data as any;
  if (siteData.socialLinks && typeof siteData.socialLinks === 'object' && !Array.isArray(siteData.socialLinks)) {
    // 从 { weibo: "url" } 转换为 [{ platform: "weibo", url: "url" }]
    siteData.socialLinks = Object.entries(siteData.socialLinks)
      .filter(([_, url]) => typeof url === 'string' && url.length > 0)
      .map(([platform, url]) => ({ platform, url: url as string }));
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/\[collection\]/route.ts
git commit -m "feat: add QR code fields to whitelist and socialLinks migration logic"
```

---

## Task 4: 更新后台页面 - 修正 socialLinks bug

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 修正 SiteEditor 中的 socialLinks 字段名**

在第 456 行，将 `data.social` 改为 `data.socialLinks`：

```typescript
const socialLinks = (data.socialLinks as SocialLink[]) ?? [];
```

- [ ] **Step 2: 添加 SocialLink 类型定义**

在文件顶部的类型定义区域（约第 30 行附近），添加：

```typescript
interface SocialLink {
  platform: 'weibo' | 'douyin' | 'bilibili' | 'xiaohongshu' | 'zhihu' | 'weixin';
  url: string;
}
```

- [ ] **Step 3: 移除旧的 setSocial 函数**

删除第 458-459 行的 `setSocial` 函数。

- [ ] **Step 4: 修改社交媒体区块渲染**

将第 490-494 行的固定社交媒体输入替换为动态列表编辑器（完整替换整个 SectionCard）：

```tsx
<SectionCard title="社交媒体">
  <ListEditor
    title="社交媒体链接"
    items={socialLinks}
    onChange={(v) => setData({ ...data, socialLinks: v })}
    createItem={() => ({ platform: 'weibo' as const, url: '' })}
    renderItem={(item, index, update) => (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={item.platform}
              onChange={(e) => update('platform', e.target.value as SocialLink['platform'])}
            >
              <option value="weibo">微博</option>
              <option value="douyin">抖音</option>
              <option value="bilibili">哔哩哔哩</option>
              <option value="xiaohongshu">小红书</option>
              <option value="zhihu">知乎</option>
              <option value="weixin">微信视频号</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">链接</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={item.url}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const newLinks = [...socialLinks];
              if (index > 0) {
                [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
                setData({ ...data, socialLinks: newLinks });
              }
            }}
            disabled={index === 0}
            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            上移
          </button>
          <button
            type="button"
            onClick={() => {
              const newLinks = [...socialLinks];
              if (index < socialLinks.length - 1) {
                [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
                setData({ ...data, socialLinks: newLinks });
              }
            }}
            disabled={index === socialLinks.length - 1}
            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            下移
          </button>
        </div>
      </div>
    )}
  />
</SectionCard>
```

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "fix: correct socialLinks field name and add dynamic social media list editor"
```

---

## Task 5: 后台添加微信二维码上传

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 在 SiteEditor 中添加微信二维码区块**

在"友情链接"区块之前（约第 475 行之前），添加新的 SectionCard：

```tsx
<SectionCard title="微信二维码">
  <ImageButton
    label="微信公众号二维码"
    value={(data.wechatOfficialQr as string) || ""}
    onChange={(v) => setData({ ...data, wechatOfficialQr: v })}
    type="qrcode"
  />
  <ImageButton
    label="微信客服二维码"
    value={(data.wechatServiceQr as string) || ""}
    onChange={(v) => setData({ ...data, wechatServiceQr: v })}
    type="qrcode"
  />
</SectionCard>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add WeChat QR code upload to site settings"
```

---

## Task 6: 更新 Footer 组件 - 数据获取

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 将 Footer 改为异步组件并获取数据**

将文件开头的组件定义从：

```tsx
export default function Footer() {
```

改为：

```tsx
import { loadSite } from "@/lib/data";

export default async function Footer() {
  const site = await loadSite();
  const friendlyLinks = (site.friendlyLinks as Array<{ label: string; href: string }>) ?? [];
  const socialLinks = (site.socialLinks as Array<{ platform: string; url: string }>) ?? [];
```

- [ ] **Step 2: 移除顶部硬编码的 friendlyLinks 数组**

删除第 49-61 行的 `friendlyLinks` 常量定义。

- [ ] **Step 3: 更新友情链接渲染**

修改第 91-108 行的友情链接渲染逻辑，使用从 API 获取的数据：

```tsx
{/* Friendly Links */}
<div className="mt-10 flex flex-wrap items-center gap-x-1 border-t border-white/10 pt-6 text-sm text-white/50">
  <span className="mr-2 text-white/70">友情链接：</span>
  {friendlyLinks.map((link, index) => (
    <span key={link.href} className="flex items-center">
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-white"
      >
        {link.label}
      </a>
      {index < friendlyLinks.length - 1 && (
        <span className="mx-2">|</span>
      )}
    </span>
  ))}
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: load friendlyLinks from site config in Footer"
```

---

## Task 7: 更新 Footer 组件 - 公司信息

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 更新公司信息区渲染**

修改第 116-135 行的公司信息渲染，使用配置数据：

```tsx
{/* Company information */}
<div className="space-y-2 text-sm text-white/50">
  <p className="text-base font-medium text-white/80">
    {site.companyName}
  </p>
  <p>地址：{site.address}</p>
  <p>
    <a
      href="https://beian.miit.gov.cn/"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors hover:text-white"
    >
      {site.icp}
    </a>
  </p>
  <p>
    Copyright &copy; {new Date().getFullYear()} {site.copyright}
  </p>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: load company info from site config in Footer"
```

---

## Task 8: 更新 Footer 组件 - 微信二维码

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 添加图片基础 URL 配置**

在组件顶部添加：

```tsx
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
```

- [ ] **Step 2: 添加二维码图片渲染函数**

在组件内部添加渲染函数：

```tsx
function renderQrCode(url: string | null, label: string) {
  if (url) {
    const imageUrl = url.startsWith('http') ? url : `${imageBaseUrl}${url}`;
    return (
      <>
        <img
          src={imageUrl}
          alt={`${label}二维码`}
          className="h-24 w-24 rounded-lg object-cover"
          onError={(e) => {
            // 图片加载失败时显示占位图标
            e.currentTarget.style.display = 'none';
            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
        <div
          className="hidden h-24 w-24 items-center justify-center rounded-lg bg-white/10"
          style={{ display: 'none' }}
        >
          <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
          </svg>
        </div>
      </>
    );
  }
  // 无配置时显示占位图标
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
      <svg className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: 更新二维码区渲染**

修改第 139-183 行的二维码区渲染：

```tsx
{/* QR codes & social media */}
<div className="flex flex-shrink-0 items-start gap-8">
  {/* WeChat Official Account QR */}
  <div className="flex flex-col items-center gap-2">
    {renderQrCode(site.wechatOfficialQr as string | null, "微信公众号")}
    <span className="text-xs text-white/50">微信公众号</span>
  </div>

  {/* WeChat Customer Service QR */}
  <div className="flex flex-col items-center gap-2">
    {renderQrCode(site.wechatServiceQr as string | null, "微信客服")}
    <span className="text-xs text-white/50">微信客服</span>
  </div>

  {/* Social media links - will be updated in next task */}
  <div className="flex flex-col gap-3 pt-1">
    <span className="text-xs font-medium text-white/60">
      关注我们
    </span>
    <div className="flex gap-3">
      {/* Placeholder - will be replaced in next task */}
    </div>
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: render WeChat QR codes from site config in Footer"
```

---

## Task 9: 更新 Footer 组件 - 社交媒体图标

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 添加新社交媒体图标组件**

在组件内部添加图标组件（在现有图标之后）：

```tsx
// Xiaohongshu Icon
function XiaohongshuIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 6.678c-2.655.182-5.346.826-5.934 1.774-.144.229-.23.483-.23.743 0 1.774 2.746 3.348 6.147 3.348 3.4 0 6.147-1.574 6.147-3.348 0-.26-.086-.514-.23-.743-.588-.948-3.279-1.592-5.934-1.774h.034zm6.373 1.774c0 .13-.022.258-.055.383-.248 1.573-2.767 2.811-5.844 2.811-3.076 0-5.595-1.238-5.843-2.81a2.146 2.146 0 01-.056-.384c0-1.774 2.747-3.348 6.148-3.348 3.4 0 6.148 1.574 6.148 3.348h-.298zm-1.07 5.724c-.358.244-.775.389-1.22.409-.483.02-.976-.15-1.368-.484-.392-.334-.683-.795-.825-1.314-.142-.52-.128-1.07.04-1.568.168-.497.473-.92.876-1.213.403-.293.877-.44 1.36-.413.483.028.94.226 1.31.568.37.342.633.81.752 1.325.12.514.09 1.053-.085 1.545-.175.492-.483.915-.886 1.208l.346.074zm-2.334-2.08c-.117.088-.266.122-.408.093-.142-.03-.26-.115-.328-.238-.068-.124-.08-.27-.033-.403.047-.133.14-.243.26-.31.12-.066.258-.083.387-.046.13.037.24.118.31.228.07.11.095.24.07.366a.476.476 0 01-.258.31zm4.233 1.003a2.614 2.614 0 01-1.31-.568c-.37-.342-.633-.81-.752-1.325-.12-.514-.09-1.053.085-1.545.175-.492.483-.915.886-1.208l-.346-.074c.358-.244.775-.389 1.22-.409.483-.02.976.15 1.368.484.392.334.683.795.825 1.314.142.52.128 1.07-.04 1.568-.168.497-.473.92-.876 1.213-.403.293-.877.44-1.36.413-.483-.028-.94-.226-1.31-.568l.31-.495z"/>
    </svg>
  );
}

// Zhihu Icon
function ZhihuIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.025 0H6.975C3.123 0 0 3.123 0 6.975v10.05C0 20.877 3.123 24 6.975 24h10.05C20.877 24 24 20.877 24 17.025V6.975C24 3.123 20.877 0 17.025 0zM7.682 19.518l-1.656-3.527H4.2v3.527H2.622v-8.34h3.19c1.6 0 2.586.965 2.586 2.425 0 1.18-.67 2.008-1.653 2.3l1.828 3.615H7.682zm6.585-5.726v-2.614h-1.58v2.614h1.58zm1.614 0v-2.614h1.578v2.614h-1.578zm-4.81 0v-2.614H9.5v2.614h1.572zm-1.572 1.577H9.5v2.453c0 .658.275.873.806.873.298 0 .615-.073.89-.18v1.374c-.34.126-.744.197-1.184.197-1.286 0-2.043-.682-2.043-1.96v-2.757zm3.196 3.656v-5.233h1.578v.733c.325-.535.82-.838 1.47-.838.275 0 .517.037.722.11v1.503a2.25 2.25 0 00-.775-.127c-.65 0-1.11.43-1.11 1.32v2.532h-1.885zm4.528 0v-5.233h1.578v.733c.324-.535.82-.838 1.47-.838.274 0 .516.037.722.11v1.503c-.22-.09-.476-.127-.776-.127-.65 0-1.11.43-1.11 1.32v2.532h-1.884zm-10.48-7.076H5.812c-.695 0-1.13-.41-1.13-1.12 0-.71.435-1.12 1.13-1.12h1.432v2.24zm10.48-1.275v-1.25h-1.578v1.25h1.578z"/>
    </svg>
  );
}

// Weixin Icon
function WeixinIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
    </svg>
  );
}

// 图标映射
const SOCIAL_ICONS: Record<string, JSX.Element> = {
  weibo: <WeiboIcon />,
  douyin: <DouyinIcon />,
  bilibili: <BilibiliIcon />,
  xiaohongshu: <XiaohongshuIcon />,
  zhihu: <ZhihuIcon />,
  weixin: <WeixinIcon />,
};

// 平台名称映射
const PLATFORM_NAMES: Record<string, string> = {
  weibo: "微博",
  douyin: "抖音",
  bilibili: "哔哩哔哩",
  xiaohongshu: "小红书",
  zhihu: "知乎",
  weixin: "微信视频号",
};
```

- [ ] **Step 2: 更新社交媒体区渲染**

替换社交媒体区的渲染逻辑（删除原有的硬编码社交媒体链接）：

```tsx
{/* Social media links */}
<div className="flex flex-col gap-3 pt-1">
  <span className="text-xs font-medium text-white/60">
    关注我们
  </span>
  <div className="flex gap-3">
    {socialLinks.map((link) => (
      <a
        key={link.platform}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={PLATFORM_NAMES[link.platform] || link.platform}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
      >
        {SOCIAL_ICONS[link.platform] || null}
      </a>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: render social media links from site config in Footer"
```

---

## Task 10: 重启开发服务器并测试

- [ ] **Step 1: 停止现有开发服务器**

Run: `pkill -f "next dev"`

- [ ] **Step 2: 重新生成 Prisma 客户端**

Run: `npx prisma generate`
Expected: "Generated Prisma Client" 成功

- [ ] **Step 3: 启动开发服务器**

Run: `nohup npm run dev > /tmp/next-dev.log 2>&1 &`

- [ ] **Step 4: 验证服务器启动**

Run: `sleep 3 && tail -20 /tmp/next-dev.log`
Expected: 看到 "Ready" 或 "Started" 消息

- [ ] **Step 5: 测试后台功能**

1. 访问 `http://localhost:3000/admin`
2. 进入"站点设置"
3. 上传微信公众号二维码图片
4. 上传微信客服二维码图片
5. 添加社交媒体链接（选择平台、输入链接）
6. 保存

- [ ] **Step 6: 测试前台 Footer**

1. 访问 `http://localhost:3000`
2. 检查公司信息是否正确显示
3. 检查友情链接是否正确显示
4. 检查微信二维码是否正确显示
5. 检查社交媒体图标是否正确显示
6. 测试社交媒体链接点击是否正确跳转

---

## 完成检查清单

- [ ] 数据库字段添加成功
- [ ] 图片上传支持 qrcode 类型
- [ ] API whitelist 更新
- [ ] socialLinks 数据迁移逻辑工作正常
- [ ] 后台可以上传微信二维码
- [ ] 后台可以添加/删除/排序社交媒体
- [ ] Footer 显示配置的公司信息
- [ ] Footer 显示配置的友情链接
- [ ] Footer 显示上传的微信二维码
- [ ] Footer 显示配置的社交媒体图标
- [ ] 所有链接可正常点击跳转
