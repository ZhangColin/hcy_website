# 专家团队管理系统设计文档

**日期:** 2026-03-31
**状态:** 设计阶段

## 概述

为 AI 师资培训页面（`/services/teacher-training`）添加后台专家团队管理功能，使专家信息可以通过后台动态维护，而非硬编码在前端。

## 需求

### 功能需求

1. **后台管理**
   - 新增专家团队菜单项
   - 支持添加、编辑、删除专家
   - 支持通过上移/下移按钮调整排序
   - 支持上传专家头像照片

2. **前端展示**
   - 从数据库读取专家数据
   - 按排序字段展示专家卡片
   - 保持现有 UI 样式不变

### 数据字段

每个专家包含 5 个字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 姓名 |
| title | string | 职称 |
| org | string | 机构 |
| focus | string | 研究方向 |
| avatar | string | 头像 URL |

## 数据结构

```typescript
interface Expert {
  id: string;
  name: string;
  title: string;
  org: string;
  focus: string;
  avatar: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

## API 设计

### 后台管理 API

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/admin/experts` | GET | 获取专家列表 |
| `/api/admin/experts` | POST | 创建新专家 |
| `/api/admin/experts/[id]` | PUT | 更新专家信息 |
| `/api/admin/experts/[id]` | DELETE | 删除专家 |

### 公开读取 API

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/public/experts` | GET | 获取已排序的专家列表（供前端使用） |

## 实现文件

### 新建文件

```
src/app/api/admin/experts/
├── route.ts           # GET (列表), POST (创建)
└── [id]/
    └── route.ts       # PUT (更新), DELETE (删除)

src/app/api/public/experts/
└── route.ts           # GET (公开列表)
```

### 修改文件

```
src/app/admin/page.tsx                    # 添加专家管理菜单和编辑器
src/app/services/teacher-training/page.tsx # 从 API 读取数据
```

## 后台界面设计

### 列表视图

- 表格形式展示专家
- 列：头像缩略图、姓名、职称、机构、操作
- 操作按钮：编辑、删除、上移、下移

### 编辑表单

使用 Modal 弹窗，包含：

1. **头像上传** - 使用现有 `ImageButton` 组件，type 设为 `experts`
2. **姓名** - 必填文本输入
3. **职称** - 必填文本输入
4. **机构** - 必填文本输入
5. **研究方向** - 必填文本输入

### 排序逻辑

- 上移：与上方元素交换 order 值
- 下移：与下方元素交换 order 值
- 初始创建时 order 设为当前最大值 + 1

## 前端展示

### 修改点

1. 将硬编码的 `experts` 数组改为服务端获取
2. 添加服务端数据获取函数
3. 保持现有卡片布局和样式不变

### 数据获取

```typescript
// 服务端组件中
async function getExperts(): Promise<Expert[]> {
  const res = await fetch(`${API_URL}/api/public/experts`, {
    next: { revalidate: 60 } // 1分钟缓存
  });
  return res.json();
}
```

## 技术细节

### 图片上传

- 复用现有的图片上传机制（`ImageButton` 组件）
- 图片存储路径：`public/uploads/experts/`
- 或使用云存储（根据项目现有配置）

### 权限控制

- 后台 API 需要验证 admin token
- 公开 API 无需认证

### 数据库

- 使用项目现有的数据库集合机制
- 集合名称：`experts`

## 实施步骤

1. 创建数据库集合和初始数据
2. 创建后台 API 路由
3. 在 admin 页面添加专家管理界面
4. 创建公开读取 API
5. 修改 teacher-training 页面使用 API 数据
6. 测试完整流程

## 未来扩展

- 其他页面可复用同一数据源
- 可添加专家分类功能
- 可添加专家详情页
