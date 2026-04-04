# Services 和 Ecosystem 页面后台管理系统设计

**日期**: 2026-03-30
**状态**: 设计阶段

---

## 1. 概述

将 `/services` 和 `/ecosystem` 两大板块的 8 个子页面改造为后台可维护系统。

### 页面清单

**Services (智教服务集群)**:
1. `/services/ai-curriculum` - AI课程入校
2. `/services/teacher-training` - AI师资培训与认证
3. `/services/ai-research-study` - AI研学
4. `/services/ecosystem-alliance` - 生态产品联盟

**Ecosystem (产融生态矩阵)**:
5. `/ecosystem/enterprise-training` - 政企AI赋能培训
6. `/ecosystem/opc` - OPC生态
7. `/ecosystem/smart-services` - 智创专项服务
8. `/ecosystem/asset-revitalization` - 不良资产盘活

---

## 2. 数据库设计

### 2.1 Prisma Schema

新增 8 个单例表，每个表包含：
- 顶层元数据字段：`title`, `subtitle`, `color`, `order`
- 页面内容区块字段：`hero`, `cta` 等各页面特定区块

```prisma
// ============ Services 页面 ============

model AiCurriculumContent {
  id        String   @id @default(cuid())
  title     String   // "AI课程入校"
  subtitle  String   // "将前沿AI课程体系引入校园，赋能基础教育与高等教育"
  color     String   @default("#1565C0")
  order     Int      @default(1)
  hero      Json     // badge, title, subtitle, cta1, cta2
  advantages Json    // cards 数组
  model     Json     // 1+N 模型
  grade     Json     // 课程体系
  platform  Json     // 三端联动
  hardware  Json     // 硬件终端
  cloud     Json     // 智研云平台
  schools   Json     // 合作学校列表
  cta       Json     // CTA
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TeacherTrainingContent {
  id        String   @id @default(cuid())
  title     String   // "AI师资培训与等级认证"
  subtitle  String   // "双轨培训+国家级认证，打造培训—认证—持证上岗闭环"
  color     String   @default("#1565C0")
  order     Int      @default(2)
  hero      Json
  dualTrack Json     // 双轨培训体系
  certification Json // 国家级认证
  stats     Json     // 核心数据
  experts   Json     // 专家团队
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AiResearchStudyContent {
  id        String   @id @default(cuid())
  title     String   // "AI研学"
  subtitle  String   // "沉浸式AI主题研学旅行与实践项目"
  color     String   @default("#00796B")
  order     Int      @default(3)
  hero      Json
  services  Json     // 4个 tab: school/enterprise/leadership/kids
  showcase  Json     // 展示项目
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model EcosystemAllianceContent {
  id        String   @id @default(cuid())
  title     String   // "生态产品联盟"
  subtitle  String   // "联合优质AI教育产品，构建开放生态"
  color     String   @default("#00796B")
  order     Int      @default(4)
  hero      Json
  model     Json     // 1+N 模型介绍
  partners  Json     // 4个生态伙伴
  value     Json     // 价值主张
  stats     Json     // 生态数据
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ============ Ecosystem 页面 ============

model EnterpriseTrainingContent {
  id        String   @id @default(cuid())
  title     String   // "政企AI赋能培训"
  subtitle  String   // "为政府与企业定制AI转型培训方案"
  color     String   @default("#00796B")
  order     Int      @default(1)
  hero      Json
  courses   Json     // 6个模块课程
  stats     Json     // 核心数据
  outcomes  Json     // 实战成果
  targets   Json     // 服务对象
  cases     Json     // 案例
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OpcContent {
  id        String   @id @default(cuid())
  title     String   // "OPC生态"
  subtitle  String   // "开放产业合作平台，连接教育与产业资源"
  color     String   @default("#00796B")
  order     Int      @default(2)
  hero      Json
  trends    Json     // 行业趋势
  barriers  Json     // 三大壁垒
  orders    Json     // 6种订单类型
  training  Json     // 培训计划
  capabilities Json // 能力等级
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SmartServicesContent {
  id        String   @id @default(cuid())
  title     String   // "智创专项服务"
  subtitle  String   // "AI技术咨询与定制化智能解决方案"
  color     String   @default("#1A3C8A")
  order     Int      @default(3)
  hero      Json
  dual      Json     // 双轮赋能
  platforms Json     // 数字工场
  consulting Json    // 智库咨询
  advantages Json    // 五大优势
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AssetRevitalizationContent {
  id        String   @id @default(cuid())
  title     String   // "不良资产盘活"
  subtitle  String   // "以AI技术赋能资产价值重塑与运营优化"
  color     String   @default("#D4A843")
  order     Int      @default(4)
  hero      Json
  triangle  Json     // 三角架构
  grips     Json     // 三大抓手
  ai        Json     // AI赋能
  process   Json     // 流程
  cta       Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 3. API 设计

### 3.1 扩展管理 API

修改 `src/app/api/admin/[collection]/route.ts`:

**新增支持的 collections**:
```typescript
const VALID_COLLECTIONS = [
  "home", "news", "about", "partners", "cases", "contact", "site", "join",
  "ai-curriculum",
  "teacher-training",
  "ai-research-study",
  "ecosystem-alliance",
  "enterprise-training",
  "opc",
  "smart-services",
  "asset-revitalization"
];
```

**GET 逻辑**: 返回对应表的唯一记录
**PUT 逻辑**: 更新对应表的记录

### 3.2 新增公开聚合 API

**`GET /api/public/services-summary`**
```json
{
  "services": [
    { "key": "ai-curriculum", "title": "AI课程入校", "subtitle": "...", "color": "#1565C0", "href": "/services/ai-curriculum" },
    // ...
  ]
}
```

**`GET /api/public/ecosystem-summary`**
```json
{
  "ecosystem": [
    { "key": "enterprise-training", "title": "政企AI赋能培训", "subtitle": "...", "color": "#00796B", "href": "/ecosystem/enterprise-training" },
    // ...
  ]
}
```

---

## 4. 后台界面设计

### 4.1 菜单结构

```typescript
const MENU_GROUPS = [
  {
    label: "智教服务集群",
    key: "services",
    children: [
      { key: "ai-curriculum", label: "AI课程入校" },
      { key: "teacher-training", label: "AI师资培训与认证" },
      { key: "ai-research-study", label: "AI研学" },
      { key: "ecosystem-alliance", label: "生态产品联盟" },
    ]
  },
  {
    label: "产融生态矩阵",
    key: "ecosystem",
    children: [
      { key: "enterprise-training", label: "政企AI赋能培训" },
      { key: "opc", label: "OPC生态" },
      { key: "smart-services", label: "智创专项服务" },
      { key: "asset-revitalization", label: "不良资产盘活" },
    ]
  },
  {
    label: "其他管理",
    items: [
      { key: "home", label: "首页内容" },
      { key: "news", label: "新闻管理" },
      { key: "about", label: "关于我们" },
      { key: "partners", label: "合作伙伴" },
      { key: "cases", label: "案例管理" },
      { key: "contact", label: "联系方式" },
      { key: "site", label: "站点设置" },
      { key: "join", label: "招聘管理" },
      { key: "consultations", label: "咨询管理" },
      { key: "users", label: "账号管理" },
    ]
  }
];
```

### 4.2 编辑器组件

每个页面一个独立的 Editor 组件，参考现有 `HomeEditor` 模式：

- `AiCurriculumEditor`
- `TeacherTrainingEditor`
- `AiResearchStudyEditor`
- `EcosystemAllianceEditor`
- `EnterpriseTrainingEditor`
- `OpcEditor`
- `SmartServicesEditor`
- `AssetRevitalizationEditor`

每个 Editor 包含多个 `SectionCard`，对应页面的各个区块。

---

## 5. 前台页面改造

### 5.1 主页面改造

**`/services` 和 `//ecosystem`**:
- 从 API 获取子页面数据
- 无数据时降级到 `zh.json`

**Header 菜单**:
- 从 summary API 获取下拉菜单数据

**首页双轮驱动**:
- 从 summary API 获取入口卡片数据

### 5.2 数据回退策略

```typescript
// 伪代码
let data = await getFromDatabase();
if (!data || data.length === 0) {
  data = getFromZhJson(); // 降级
}
```

---

## 6. 数据初始化策略

### 6.1 安全原则

1. **只插入，不删除**：绝不使用 `prisma.xxx.deleteMany()`
2. **先检查后插入**：只有表为空时才插入初始数据
3. **生产备份**：迁移前必须备份数据库

### 6.2 初始化脚本逻辑

```typescript
async function seedServicePages() {
  const tables = [
    { model: prisma.aiCurriculumContent, zhKey: 'services.aiCurriculumPage' },
    // ... 其他7个
  ];

  for (const table of tables) {
    const existing = await table.model.count();
    if (existing > 0) {
      console.log(`✓ ${table.zhKey} 已有数据，跳过`);
      continue;
    }

    const data = extractFromZhJson(table.zhKey);
    await table.model.create({ data });
    console.log(`✓ ${table.zhKey} 初始化完成`);
  }
}
```

### 6.3 部署流程

```bash
# 1. 备份生产数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 2. 生成迁移
npx prisma migrate dev --name add_service_pages

# 3. 应用迁移
npx prisma migrate deploy

# 4. 初始化数据（只插入，不删除）
npm run seed-service-pages
```

---

## 7. 实现文件清单

### 新增文件

| 文件路径 | 说明 |
|---------|------|
| `prisma/schema.prisma` | 新增 8 个模型 |
| `src/app/api/admin/[collection]/route.ts` | 扩展支持的 collections |
| `src/app/api/public/services-summary/route.ts` | 新增公开 API |
| `src/app/api/public/ecosystem-summary/route.ts` | 新增公开 API |
| `src/app/admin/page.tsx` | 调整菜单结构 |
| `src/app/admin/editors/AiCurriculumEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/TeacherTrainingEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/AiResearchStudyEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/EcosystemAllianceEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/EnterpriseTrainingEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/OpcEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/SmartServicesEditor.tsx` | 新增编辑器 |
| `src/app/admin/editors/AssetRevitalizationEditor.tsx` | 新增编辑器 |
| `scripts/seed-service-pages.ts` | 数据初始化脚本 |

### 修改文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/app/services/page.tsx` | 改为从 API 获取数据 |
| `src/app/ecosystem/page.tsx` | 改为从 API 获取数据 |
| `src/components/Header.tsx` | 菜单数据改为从 API 获取 |
| `src/app/page.tsx` | 首页双轮驱动改为从 API 获取 |

---

## 8. 实施步骤

1. **数据库迁移**: 添加 8 个新表
2. **API 扩展**: 支持 8 个新 collection 的 CRUD
3. **公开 API**: 新增 2 个 summary 接口
4. **后台界面**: 调整菜单 + 8 个编辑器组件
5. **前台改造**: 主页面、Header、首页从 API 获取数据
6. **数据初始化**: 从 zh.json 导入初始数据
7. **测试验证**: 功能测试 + 降级测试

---

**文档版本**: v1.0
**状态**: 待审核
