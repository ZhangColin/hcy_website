# 案例与成果后台管理系统设计

**日期**: 2026-03-29
**状态**: 设计中

## 1. 概述

将前台"案例与成果"页面从硬编码数据迁移到数据库管理，支持后台维护学校案例和赛事荣誉数据，支持上传封面图和学校 logo。

## 2. 需求范围

### 2.1 包含内容
- **学校案例**: 从硬编码迁移到数据库，支持封面图和学校 logo
- **赛事荣誉**: 新设计卡片展示，支持奖杯图片

### 2.2 不包含内容
- 标杆项目 (benchmarkProjects) - 保持硬编码
- 荣誉时间线 (timelineAwards) - 保持硬编码

## 3. 数据库设计

### 3.1 SchoolCase 表扩展

```prisma
model SchoolCase {
  id           String   @id @default(cuid())
  name         String              // 学校名称
  region       String              // 地区: "北京"|"上海"|"浙江"|"其他"
  grade        String              // 学段 JSON 数组: ["小学", "初中", "高中"]
  abbr         String              // 缩写: "北中", "上外" 等
  partnership  String              // 合作内容描述
  results      String              // 成果描述
  color        String              // 颜色渐变 class: "from-[#1A3C8A] to-[#2B6CB0]"
  coverImage   String?             // 封面图 URL (可选)
  schoolLogo   String?             // 学校 logo URL (可选)
  order        Int      @default(0) // 排序
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 3.2 CompetitionHonor 表扩展

```prisma
model CompetitionHonor {
  id           String   @id @default(cuid())
  title        String              // 赛事名称
  level        String              // 级别: "国际"|"全国"
  year         String              // 年份
  achievements String              // 获奖成果描述
  image        String?             // 奖杯/奖牌图片 URL (可选)
  order        Int      @default(0) // 排序
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## 4. API 设计

### 4.1 后台管理接口

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/admin/cases` | GET | 获取所有案例和荣誉数据 |
| `/api/admin/cases/schools` | POST | 新增学校案例 |
| `/api/admin/cases/schools/[id]` | PATCH | 更新学校案例 |
| `/api/admin/cases/schools/[id]` | DELETE | 删除学校案例 |
| `/api/admin/cases/competitions` | POST | 新增赛事荣誉 |
| `/api/admin/cases/competitions/[id]` | PATCH | 更新赛事荣誉 |
| `/api/admin/cases/competitions/[id]` | DELETE | 删除赛事荣誉 |
| `/api/admin/cases/reorder` | POST | 批量更新排序 |

### 4.2 前台展示接口

| 路径 | 方法 | 返回 |
|------|------|------|
| `/api/cases` | GET | `{ schoolCases, competitionHonors }` |

### 4.3 图片上传

复用现有 `/api/upload` 接口上传图片。

## 5. 前台展示设计

### 5.1 学校案例卡片

```
┌─────────────────────────────────────┐
│  封面图 OR 渐变背景色                │
│    [学校Logo OR 缩写文字]           │
│                                     │
└─────────────────────────────────────┘
│  学校名称  [学段标签1][学段标签2]    │
│  合作内容...                        │
│  ★ 成果...                          │
└─────────────────────────────────────┘
```

**图片回退逻辑**:
- 无封面图 → 使用 `color` 渐变背景
- 无学校 logo → 显示 `abbr` 缩写文字

### 5.2 赛事荣誉卡片

```
┌────────────────────┐
│  [奖杯图/图标]     │  ← 可选
│                    │
│  赛事名称          │
│                    │
│  获奖成果          │
│  年份              │
└────────────────────┘
```

**样式区分**:
- 国际级别: 金色边框/背景
- 全国级别: 蓝色边框/背景

## 6. 后台管理界面

### 6.1 学校案例管理

- 列表展示所有案例
- 支持拖拽排序
- 添加/编辑/删除功能
- 表单字段:
  - 学校名称 (文本)
  - 地区 (下拉: 北京/上海/浙江/其他)
  - 学段 (多选: 小学/初中/高中)
  - 缩写 (文本)
  - 合作内容 (多行文本)
  - 成果 (多行文本)
  - 颜色 (预设渐变下拉选择)
  - 封面图 (图片上传，可选)
  - 学校 Logo (图片上传，可选)

### 6.2 赛事荣誉管理

- 列表展示所有荣誉
- 支持拖拽排序
- 添加/编辑/删除功能
- 表单字段:
  - 赛事名称 (文本)
  - 级别 (下拉: 国际/全国)
  - 年份 (文本)
  - 获奖成果 (文本)
  - 奖杯图片 (图片上传，可选)

## 7. 数据迁移

### 7.1 迁移脚本

创建 `prisma/seed-cases.ts` 将现有硬编码数据迁移到数据库。

**学校案例初始数据** (6条):
- 北京中学
- 上外附中
- 海亮教育
- 绵阳南山中学
- 北京开放大学
- 其他代表院校

**赛事荣誉初始数据** (6条):
- Intel AI全球影响力嘉年华 (2023, 全球总冠军)
- 丘成桐中学科学奖 (2024, 全球总冠军)
- ISEF 国际科学与工程大奖赛 (2024, 全球总冠军)
- 全国青少年人工智能创新挑战赛 (2022-2024, 全国总冠军 x3)
- 全国中小学信息技术创新与实践大赛 (2023-2024, 全国总冠军 x2)
- 世界机器人大赛 (2023, 全国总冠军 x2)

## 8. 实现文件清单

### 8.1 数据库
- `prisma/schema.prisma` - 修改 SchoolCase 和 CompetitionHonor 模型
- `prisma/seed-cases.ts` - 新建数据迁移脚本

### 8.2 后端 API
- `src/app/api/cases/route.ts` - 新建前台数据接口
- `src/app/api/admin/cases/route.ts` - 修改后台管理接口
- `src/app/api/admin/cases/schools/[id]/route.ts` - 新建案例 CRUD
- `src/app/api/admin/cases/competitions/[id]/route.ts` - 新建荣誉 CRUD
- `src/app/api/admin/cases/reorder/route.ts` - 新建排序接口
- `src/lib/data.ts` - 修改 loadCases 函数

### 8.3 前台页面
- `src/app/cases/page.tsx` - 修改为从 API 获取数据

### 8.4 后台管理
- `src/app/admin/page.tsx` - 修改 CasesEditor 组件

## 9. 验收标准

1. 后台可以添加、编辑、删除学校案例
2. 后台可以添加、编辑、删除赛事荣誉
3. 支持拖拽排序
4. 封面图和 logo 可选上传，无图时显示默认样式
5. 前台正确显示从数据库获取的数据
6. 初始数据通过迁移脚本正确导入
