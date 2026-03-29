# 联系我们页面增强设计文档

**日期:** 2026-03-29
**状态:** 待审核

## 概述

增强"联系我们"页面，实现前后台数据一致，支持完整的地址信息管理和分业务联系人展示（含头像）。

## 当前问题

1. **地址信息硬编码**：前端显示的联系电话（010-XXXX-XXXX）和邮箱（contact@haichuangyuan.com）是硬编码的
2. **联系人信息不完整**：数据库已有 phone/email 字段，但前端不显示
3. **地图占位**：地图区域仅为占位符，无实际地图
4. **无头像功能**：分业务联系人无法上传头像

## 设计方案

### 1. 数据库改动

#### SiteConfig 表新增字段

```prisma
model SiteConfig {
  id            String @id @default(cuid())
  companyName   String
  shortName     String
  address       String
  phone         String?  // 新增：公司联系电话
  email         String?  // 新增：公司邮箱
  mapLng        String?  // 新增：地图经度（高德地图）
  mapLat        String?  // 新增：地图纬度
  icp           String
  copyright     String
  friendlyLinks Json
  socialLinks   Json
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### ContactInfo contacts Json 结构扩展

```typescript
interface BusinessContact {
  department: string;  // 部门/业务线
  person: string;      // 联系人
  phone: string;       // 电话
  email: string;       // 邮箱
  avatar: string;      // 头像URL（新增）
}
```

### 2. 后台改动

#### SiteEditor 组件

新增字段编辑：
- 公司电话
- 公司邮箱
- 地图经度
- 地图纬度

#### ContactEditor 组件

- **移除**：地址编辑（已迁移到 SiteConfig）
- **保留**：分业务联系人列表编辑
- **新增**：联系人头像上传（复用 ImageButton 组件，type 设为 "contacts"）

### 3. API 改动

#### `/api/admin/contact` GET/PUT

- 返回/更新 contacts 数组，支持 avatar 字段

#### `/api/admin/site` GET/PUT

- 返回/更新时包含 phone, email, mapLng, mapLat 字段
- FIELD_WHITELISTS 添加相应字段

### 4. 前端改动

#### 数据加载

```typescript
// ContactPageClient 需要同时加载 contact 和 site 数据
const [contactData, siteData] = await Promise.all([
  loadData("contact"),
  loadData("site")
])
```

#### 地址区域

- 地址、电话、邮箱从 siteData 读取
- 集成高德地图组件，使用 mapLng/mapLat 定位

#### 分业务联系人卡片

布局设计：
```
┌─────────────┐
│   (头像)    │ ← 圆形头像，使用 avatar 字段，无头像时显示默认图标
│   综合业务   │ ← department
│   赵元章    │ ← person
│ 📞 138...   │ ← phone（有值时显示）
│ 📧 xxx@...  │ ← email（有值时显示）
└─────────────┘
```

- 顶部显示圆形头像（约 60x60px）
- 头像下方显示部门名称（加粗）
- 联系人姓名
- 电话（如有）
- 邮箱（如有）

#### 高德地图集成

使用高德地图 WebJS API，展示公司位置标记。

### 5. 文件清单

#### 需要修改的文件

| 文件 | 改动内容 |
|------|----------|
| `prisma/schema.prisma` | SiteConfig 添加 phone/email/mapLng/mapLat 字段 |
| `src/app/api/admin/[collection]/route.ts` | site 的 FIELD_WHITELISTS 添加新字段 |
| `src/app/admin/page.tsx` | SiteEditor 添加新字段；ContactEditor 添加头像上传 |
| `src/lib/data.ts` | loadContact 返回类型更新 |
| `src/components/ContactPageClient.tsx` | 从 site config 读取地址信息；联系人卡片显示头像/电话/邮箱；集成高德地图 |

#### 需要新增的文件

| 文件 | 说明 |
|------|------|
| `src/components/AMap.tsx` | 高德地图组件 |

### 6. 数据迁移

执行数据库迁移后，需要手动初始化 SiteConfig 的 mapLng/mapLat 值（可通过高德地图拾取坐标工具获取）。

### 7. 环境变量

无需新增环境变量。高德地图 API Key 可后续配置，首次使用可使用测试 Key。

## 实施步骤

1. 修改 Prisma schema，执行迁移
2. 更新 API 路由的 field whitelists
3. 修改后台 SiteEditor 和 ContactEditor
4. 修改前端 ContactPageClient
5. 创建高德地图组件
6. 测试前后台数据一致性

## 验收标准

- [ ] 后台"站点设置"可编辑公司电话、邮箱、地图坐标
- [ ] 后台"联系方式"可上传联系人头像
- [ ] 前端地址区域显示从数据库读取的电话和邮箱
- [ ] 前端显示正确的高德地图位置
- [ ] 前端联系人卡片显示头像、电话、邮箱
