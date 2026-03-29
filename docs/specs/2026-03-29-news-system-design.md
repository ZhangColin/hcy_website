# 新闻动态系统设计文档

**日期:** 2026-03-29
**作者:** Claude & 用户
**状态:** 设计中

---

## 一、概述

### 1.1 目标
升级新闻动态系统，实现完整的内容管理功能：
- 新闻列表管理（无"大保存"）
- 富文本编辑器（Tiptap）
- 新闻详情页
- 首页新闻关联
- 案例管理"大保存"移除

### 1.2 约束条件
- 复用现有腾讯云 COS 上传
- 保持网站主题风格（蓝色渐变 #1A3C8A，金色 #D4A843）
- 案例管理仅移除"大保存"按钮，其他不动

### 1.3 架构决策说明

**为什么新闻管理使用独立页面/独立 API？**

现有后台管理 (`/admin/page.tsx`) 使用 SPA 单页模式，适合简单的内联编辑。但新闻系统有以下特殊需求：

1. **富文本编辑器** - 需要更大空间和专注的编辑环境
2. **独立编辑页** - 用户明确要求"文章编辑跳转一个新页面"
3. **复杂表单** - 字段较多，独立页面体验更好

因此：
- **新闻管理** → 独立页面 (`/admin/news`) + 独立 API (`/api/admin/news`)
- **案例管理** → 保持现有 SPA 模式，仅移除"大保存"按钮

---

## 二、数据库设计

### 2.1 NewsArticle 模型调整

```prisma
model NewsArticle {
  id            String   @id @default(cuid())
  slug          String   @unique           // URL 友好标识
  title         String
  excerpt       String
  content       String                     // HTML 格式
  category      String                     // company | industry | media
  date          DateTime
  image         String?
  featured      Boolean  @default(false)   // 是否置顶
  showOnHomepage Boolean @default(true)    // 是否首页显示
  published     Boolean  @default(true)    // 是否发布
  views         Int      @default(0)       // 浏览量
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([date, published])
  @@index([featured, date])
}
```

### 2.2 Slug 生成规则

```typescript
// 格式: {pinyin}-{date}-{random}
// 示例: xinwen-gsgs-20260329-a1b2c3

import { pinyin } from 'pinyin-pro';

function generateSlug(title: string): string {
  // 1. 中文转拼音首字母
  const pinyinStr = pinyin(title, { pattern: 'first', toneType: 'none' })
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 20); // 限制长度

  // 2. 添加日期和随机后缀
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7);

  return `${pinyinStr}-${date}-${random}`;
}

// 冲突处理: 自动追加数字后缀 (如 -2, -3)
// 允许手动修改，需验证唯一性
```

### 2.3 数据迁移

```typescript
// prisma/migrations/xxx_add_news_fields/migration.sql
// 1. 添加新字段
// 2. 为现有数据生成 slug
// 3. 设置默认值
```

- 现有数据自动生成 `slug`（基于上述规则）
- `featured` 默认 false
- `showOnHomepage` 默认 true
- `views` 初始 0

---

## 三、API 设计

### 3.1 后台管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/news` | 新闻列表（分页、筛选） |
| POST | `/api/admin/news` | 创建新闻 |
| GET | `/api/admin/news/[id]` | 获取详情 |
| PUT | `/api/admin/news/[id]` | 更新新闻 |
| DELETE | `/api/admin/news/[id]` | 删除新闻 |
| PATCH | `/api/admin/news/[id]/publish` | 发布/下架 |
| PATCH | `/api/admin/news/[id]/feature` | 设置/取消置顶 |
| PATCH | `/api/admin/news/[id]/homepage` | 设置/取消首页显示 |

### 3.2 前台 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/news` | 新闻列表（支持 homepage 参数） |
| GET | `/api/news/[slug]` | 新闻详情（浏览量+1） |

### 3.3 查询参数

**列表查询:**
- `page` / `limit` - 分页
- `category` - 分类筛选
- `published` - 发布状态
- `search` - 关键词搜索
- `homepage` - 仅首页显示

### 3.4 权限验证

- `/api/admin/news/*` 所有接口都需要管理员权限验证
- 复用现有 `src/lib/auth.ts` 中的 `authenticateRequest` 中间件
- 前台 API (`/api/news/*`) 无需权限验证

---

**列表查询:**
- `page` / `limit` - 分页
- `category` - 分类筛选
- `published` - 发布状态
- `search` - 关键词搜索
- `homepage` - 仅首页显示

---

## 四、页面设计

### 4.1 新闻列表管理页

**路径:** `/admin/news`

**布局:**
- 顶部：标题 + 新建按钮
- 筛选栏：分类、状态、搜索
- 列表：标题、日期、分类、状态、操作
- 分页

**操作:**
- 编辑 → 跳转 `/admin/news/[id]/edit`
- 新建 → 跳转 `/admin/news/new`
- 下架/发布 → 直接 API 调用

### 4.2 新闻编辑页

**路径:** `/admin/news/new` | `/admin/news/[id]/edit`

**表单字段:**
- 标题 *（必填）
- URL 标识 *（自动生成，可修改）
- 分类 *、日期 *
- 复选框：置顶、首页显示、已发布
- 封面图片（ImageButton 组件）
- 摘要（多行文本）
- 正文内容 *（Tiptap 富文本编辑器）
- 浏览量（只读）

**Tiptap 工具栏:**
- 粗体、斜体、下划线
- 标题（H1-H3）
- 列表（有序/无序）
- 链接、图片上传
- 撤销/重做

**图片上传配置:**
- 上传目录: `news/editor/`
- 调用 `/api/upload` 接口
- 图片样式: `max-width: 100%`, `height: auto`
- 大小限制: 5MB（编辑器内图片）

### 4.3 新闻详情页（前台）

**路径:** `/news/[slug]`

**内容结构:**
1. 面包屑导航
2. 封面图片（完整宽度）
3. 分类标签 + 日期
4. 标题
5. 正文内容
6. 分享按钮（微博、微信、复制链接）
7. 上一篇/下一篇导航
8. 相关新闻推荐（同分类 3 篇）

### 4.4 首页调整

**位置:** `src/app/page.tsx` 新闻预览模块

**调整:**
- 新闻卡片链接改为 `/news/[slug]`
- 后端返回 `showOnHomepage=true` 的数据

---

## 五、案例管理调整

**位置:** `src/app/admin/page.tsx` CasesEditor

**调整:**
- 当 `activeSection === "cases"` 时，隐藏顶部通用保存按钮
- 保留 CasesEditor 模态框内的保存按钮不变
- 保存逻辑不变（每次模态框保存直接调用 API）

```typescript
// 修改前
<button onClick={handleSave}>保存</button>  // 所有 section 都显示

// 修改后
{showSaveButton && <button onClick={handleSave}>保存</button>}
const showSaveButton = activeSection !== "cases";
```

---

## 六、错误处理

### 6.1 API 统一错误响应格式

```typescript
// 成功
{ success: true, data: {...} }

// 失败
{ success: false, error: "错误描述", code: "ERROR_CODE" }
```

### 6.2 前端表单验证

| 字段 | 验证规则 |
|------|----------|
| 标题 | 必填，1-100 字符 |
| URL 标识 | 必填，a-z0-9-，唯一 |
| 分类 | 必填，枚举值 |
| 日期 | 必填，有效日期 |
| 摘要 | 可选，最多 200 字符 |
| 正文 | 必填，HTML 内容 |

### 6.3 网络失败处理

- 上传失败：显示错误提示，保留已填写内容
- API 超时：3 秒超时，显示重试按钮
- 并发冲突：使用 updatedAt 乐观锁

---

## 七、依赖项

### 7.1 新增 npm 包

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "pinyin-pro": "^3.x"
}
```

### 7.2 复用现有

- 腾讯云 COS 上传（`src/lib/cos.ts`）
- 认证中间件（`src/lib/auth.ts`）
- ImageButton 组件

---

## 八、文件清单

### 8.1 新增文件

```
src/app/admin/news/page.tsx                    # 新闻列表管理页
src/app/admin/news/new/page.tsx                # 新建新闻页
src/app/admin/news/[id]/edit/page.tsx          # 编辑新闻页
src/app/api/admin/news/route.ts                # 新闻列表/创建 API
src/app/api/admin/news/[id]/route.ts           # 新闻详情/更新/删除 API
src/app/api/admin/news/[id]/publish/route.ts   # 发布状态 API
src/app/api/admin/news/[id]/feature/route.ts   # 置顶 API
src/app/api/admin/news/[id]/homepage/route.ts  # 首页显示 API
src/app/api/news/route.ts                      # 前台新闻列表 API
src/app/api/news/[slug]/route.ts               # 前台新闻详情 API
src/app/news/[slug]/page.tsx                   # 前台新闻详情页
src/components/NewsEditorClient.tsx            # 新闻编辑客户端组件
src/components/TiptapEditor.tsx                # Tiptap 编辑器封装
src/components/NewsDetailClient.tsx            # 新闻详情客户端组件
```

### 8.2 修改文件

```
prisma/schema.prisma                           # NewsArticle 模型
src/app/admin/page.tsx                         # 移除 cases 大保存按钮
src/app/page.tsx                               # 首页新闻链接调整
src/app/news/page.tsx                          # 新闻列表页链接调整
src/app/news/NewsClient.tsx                    # 新闻卡片链接调整
```

---

## 九、实施顺序

1. 安装依赖（Tiptap、pinyin-pro）
2. 数据库迁移（Prisma migrate + 数据填充）
3. Slug 生成工具函数
4. 后端 API 开发
5. 后台管理页（列表 + 编辑）
6. 前台详情页
7. 首页关联
8. 案例管理"大保存"移除
9. 测试与验收

---

## 十、SEO 考量

### 10.1 Meta 标签

```typescript
// 动态生成
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
    },
  };
}
```

### 10.2 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "标题",
  "image": "图片URL",
  "datePublished": "2024-03-20",
  "dateModified": "2024-03-20"
}
```

---

1. 数据库迁移（Prisma migrate）
2. 后端 API 开发
3. 后台管理页（列表 + 编辑）
4. 前台详情页
5. 首页关联
6. 案例管理"大保存"移除
7. 测试与验收
