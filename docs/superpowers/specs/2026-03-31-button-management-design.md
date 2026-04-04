# 页面按钮管理系统 - 设计文档

## 一、需求概述

为网站各页面（如智教服务集群、产融生态矩阵等）的按钮提供后台管理功能，管理员可以配置按钮的文字、跳转链接，支持外链。

## 二、数据模型

### 2.1 数据库表结构

```prisma
model PageButton {
  id          String   @id @default(cuid())
  pageKey     String   // 页面标识，如 "ai-curriculum"
  pageName    String   // 页面中文名称，如 "AI课程入校"
  positionKey String   // 位置标识，如 "hero", "cta"
  positionName String  // 位置中文名称，如 "顶部横幅区域"
  label       String   // 按钮文字
  href        String   // 跳转链接
  openNewTab  Boolean  @default(false)  // 是否新窗口打开
  order       Int      @default(0)      // 显示顺序
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([pageKey, positionKey, order])
  @@index([pageKey, positionKey])
}
```

### 2.2 初始数据

初始化脚本位于 `sql/init_page_buttons.sql`，包含以下页面的按钮配置：

| 页面 | 位置区域 | 按钮示例 |
|------|----------|----------|
| AI课程入校 | Hero、CTA | 了解1+N模式、预约课程演示、下载方案白皮书 |
| 生态产品联盟 | Hero、CTA | 成为生态合作伙伴、了解生态品牌 |
| AI研学 | Hero、CTA | 预约课程演示、了解研学方案 |
| 师资培训 | Hero、CTA | 预约师资培训、了解认证体系 |
| 智教服务集群首页 | CTA | 了解服务详情、联系我们 |

## 三、后台管理界面

### 3.1 菜单入口

在 `/admin` 侧边栏添加新菜单项：

```typescript
{ key: "buttons", label: "按钮管理" }
```

### 3.2 界面结构

```
┌─────────────────────────────────────────────────────────┐
│  按钮管理                                    [保存] 按钮  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ▼ AI课程入校                                           │
│    ├── 顶部横幅区域 (Hero)                              │
│    │   ├── [了解1+N模式] [#model        ] [□新窗] [↑↓] │
│    │   └── [预约课程演示] [#contact      ] [□新窗] [↑↓] │
│    ├── 底部行动号召区域 (CTA)                           │
│    │   ├── [预约课程演示] [#contact      ] [□新窗] [↑↓] │
│    │   ├── [下载方案白皮书] [/download/... ] [✓新窗] [↑↓]│
│    │   └── [联系我们      ] [/contact      ] [□新窗] [↑↓] │
│                                                         │
│  ▼ 生态产品联盟                                         │
│    ├── 顶部横幅区域 (Hero)                              │
│    │   ├── [成为生态合作伙伴] [#cta        ] [□新窗] [↑↓] │
│    │   └── [了解生态品牌    ] [#partners    ] [□新窗] [↑↓] │
│    └── 底部行动号召区域 (CTA)                           │
│         ...                                             │
└─────────────────────────────────────────────────────────┘
```

### 3.3 编辑项说明

| 字段 | 说明 |
|------|------|
| 按钮文字 | 按钮显示的文本，如"预约课程演示" |
| 跳转链接 | 按钮点击后的目标地址，支持锚点(如#model)和绝对路径(如/contact) |
| 新窗口打开 | 勾选后链接在新标签页打开 |
| 顺序调整 | 点击↑↓按钮调整按钮显示顺序 |

## 四、API 接口

### 4.1 后台管理接口

#### 获取所有按钮配置
```
GET /api/admin/buttons
Authorization: Bearer {token}

Response:
{
  "buttons": [
    {
      "id": "btn_001_ai_curriculum_hero_1",
      "pageKey": "ai-curriculum",
      "pageName": "AI课程入校",
      "positionKey": "hero",
      "positionName": "顶部横幅区域",
      "label": "了解1+N模式",
      "href": "#model",
      "openNewTab": false,
      "order": 0
    },
    ...
  ]
}
```

#### 批量更新按钮配置
```
PUT /api/admin/buttons
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "buttons": [
    {
      "id": "btn_001_ai_curriculum_hero_1",
      "label": "了解1+N模式",
      "href": "#model",
      "openNewTab": false,
      "order": 0
    },
    ...
  ]
}

Response:
{
  "success": true,
  "message": "保存成功"
}
```

### 4.2 前端展示接口

#### 获取指定页面的按钮配置
```
GET /api/buttons/:pageKey

Response:
{
  "hero": [
    { "label": "了解1+N模式", "href": "#model", "openNewTab": false },
    { "label": "预约课程演示", "href": "#contact", "openNewTab": false }
  ],
  "cta": [
    { "label": "预约课程演示", "href": "#contact", "openNewTab": false },
    { "label": "下载方案白皮书", "href": "/download/whitepaper", "openNewTab": true },
    { "label": "联系我们", "href": "/contact", "openNewTab": false }
  ]
}
```

## 五、前端集成

### 5.1 数据加载函数

在 `src/lib/data.ts` 添加：

```typescript
// 加载页面按钮配置
export async function loadPageButtons(pageKey: string) {
  const res = await fetch(`/api/buttons/${pageKey}`);
  if (!res.ok) return { hero: [], cta: [] };
  return await res.json();
}
```

### 5.2 页面组件改造

示例：`src/app/services/ai-curriculum/page.tsx`

```tsx
// 原来：硬编码按钮
<a href="#model" className="...">了解1+N模式</a>
<a href="#contact" className="...">预约课程演示</a>

// 改为：从配置读取
const [buttons, setButtons] = useState({ hero: [], cta: [] });

useEffect(() => {
  fetch('/api/buttons/ai-curriculum')
    .then(res => res.json())
    .then(setButtons);
}, []);

{buttons.hero.map((btn, i) => (
  <a
    key={i}
    href={btn.href}
    target={btn.openNewTab ? '_blank' : undefined}
    rel={btn.openNewTab ? 'noopener noreferrer' : undefined}
    className="..."
  >
    {btn.label}
  </a>
))}
```

## 六、实施步骤

1. **数据库准备**
   - 执行 `sql/init_page_buttons.sql` 创建表并初始化数据
   - 更新 `prisma/schema.prisma` 添加 PageButton 模型
   - 运行 `npx prisma generate` 更新 Prisma Client

2. **后端 API 开发**
   - 创建 `src/app/api/admin/buttons/route.ts`
   - 创建 `src/app/api/buttons/[pageKey]/route.ts`

3. **后台管理界面**
   - 在 `src/app/admin/page.tsx` 添加 ButtonsEditor 组件
   - 添加菜单项

4. **前端页面改造**
   - 修改各服务页面组件，从 API 读取按钮配置
   - 保持原有样式不变

## 七、文件清单

| 文件路径 | 说明 |
|----------|------|
| `sql/init_page_buttons.sql` | 数据库初始化脚本 |
| `prisma/schema.prisma` | 添加 PageButton 模型 |
| `src/app/api/admin/buttons/route.ts` | 后台管理 API |
| `src/app/api/buttons/[pageKey]/route.ts` | 前端展示 API |
| `src/lib/data.ts` | 添加 loadPageButtons 函数 |
| `src/app/admin/page.tsx` | 添加按钮管理界面 |
