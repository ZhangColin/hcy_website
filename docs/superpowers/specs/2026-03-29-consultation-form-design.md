# 在线咨询表单功能设计

**日期：** 2026-03-29
**状态：** 已批准

## 概述

为联系页面添加完整的在线咨询表单功能，包括数据存储、后台管理、搜索筛选和数据导出。

## 功能需求

1. 用户可在联系页面提交咨询表单
2. 表单数据保存到数据库
3. 后台可查看、搜索、筛选、导出咨询数据
4. 可标记咨询为"已回复"并添加备注
5. Header和浮动按钮跳转到表单区域
6. 表单右侧显示微信客服二维码（来自站点配置）

## 数据库设计

### ContactSubmission 模型变更

```prisma
model ContactSubmission {
  id         String   @id @default(cuid())
  name       String
  company    String?
  phone      String
  email      String?
  needType   String
  message    String   @db.Text
  handled    Boolean  @default(false)
  repliedAt  DateTime?  // 新增：回复时间
  replyNotes String?   @db.Text  // 新增：回复备注
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt  // 新增：更新时间
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 唯一标识 |
| name | String | 姓名（必填） |
| company | String? | 单位名称（可选） |
| phone | String | 联系电话（必填） |
| email | String? | 邮箱地址（可选） |
| needType | String | 需求类型（必填） |
| message | String | 留言内容（必填） |
| handled | Boolean | 是否已回复（默认false） |
| repliedAt | DateTime? | 回复时间 |
| replyNotes | String? | 回复备注 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## API 设计

### 1. 提交咨询

**端点：** `POST /api/contact/submit`

**请求体：**
```json
{
  "name": "张三",
  "company": "某某公司",
  "phone": "13800138000",
  "email": "zhang@example.com",
  "needType": "AI课程入校",
  "message": "想了解具体的课程内容..."
}
```

**验证规则：**
- 姓名、电话、需求类型、留言必填
- 手机号：1开头，11位数字
- 邮箱：标准邮箱格式（如果填写）

**响应：**
```json
// 成功
{ "success": true }

// 失败
{
  "success": false,
  "errors": {
    "phone": "请输入正确的手机号码"
  }
}
```

### 2. 获取咨询列表

**端点：** `GET /api/admin/consultations`

**查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码（默认1） |
| limit | number | 每页数量（默认20） |
| search | string | 搜索关键词（姓名/电话/邮箱/单位） |
| needType | string | 需求类型筛选 |
| handled | boolean | 处理状态筛选 |
| startDate | string | 开始日期 (YYYY-MM-DD) |
| endDate | string | 结束日期 (YYYY-MM-DD) |
| sortBy | string | 排序字段 (createdAt/repliedAt) |
| order | 'asc' \| 'desc' | 排序方向 |

**响应：**
```json
{
  "items": [
    {
      "id": "...",
      "name": "张三",
      "company": "某某公司",
      "phone": "13800138000",
      "email": "zhang@example.com",
      "needType": "AI课程入校",
      "message": "想了解...",
      "handled": false,
      "repliedAt": null,
      "replyNotes": null,
      "createdAt": "2026-03-29T14:30:00Z",
      "updatedAt": "2026-03-29T14:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### 3. 更新咨询记录

**端点：** `PATCH /api/admin/consultations/[id]`

**请求体：**
```json
{
  "handled": true,
  "replyNotes": "已电话沟通，客户感兴趣"
}
```

**响应：** 更新后的记录对象

### 4. 批量操作

**端点：** `POST /api/admin/consultations/batch`

**请求体：**
```json
{
  "ids": ["id1", "id2", "id3"],
  "action": "markHandled" | "markUnhandled" | "delete"
}
```

### 5. 导出数据

**端点：** `GET /api/admin/consultations/export`

**响应：** CSV 文件

### 6. 删除记录

**端点：** `DELETE /api/admin/consultations/[id]`

## 前端修改

### 1. Header.tsx

修改"在线咨询"按钮和浮动按钮的链接：

```tsx
// 修改前
<Link href="/consultation">

// 修改后
<Link href="/contact#form">
```

### 2. ContactPageClient.tsx

**a) 表单提交逻辑**

- 移除仅前端验证的提交逻辑
- 添加调用 `/api/contact/submit` 的 fetch 请求
- 处理 API 返回的错误信息

**b) 微信二维码显示**

```tsx
// 替换占位符为实际图片
{siteData.wechatServiceQr ? (
  <Image
    src={siteData.wechatServiceQr.startsWith('http')
      ? siteData.wechatServiceQr
      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${siteData.wechatServiceQr}`}
    alt="微信客服"
    width={192}
    height={192}
    className="w-48 h-48"
  />
) : (
  // 占位符
)}
```

### 3. 新增 API Route

**文件：** `src/app/api/contact/submit/route.ts`

功能：
- 接收 POST 请求
- 验证表单字段
- 保存到数据库
- 返回结果

## 后台管理界面

### 1. 菜单添加

在 `admin/page.tsx` 的 `NAV_ITEMS` 添加：

```tsx
{ key: "consultations", label: "咨询管理" }
```

### 2. ConsultationsEditor 组件

**功能列表：**
- 分页列表展示
- 搜索（姓名、电话、邮箱、单位）
- 筛选（需求类型、处理状态、日期范围）
- 排序（时间、状态）
- 批量选择和操作
- 单条详情查看
- 标记已处理/未处理
- 添加回复备注
- 导出 CSV

### 3. 界面布局

```
┌─────────────────────────────────────────────────────┐
│ 咨询管理                           [导出CSV]         │
├─────────────────────────────────────────────────────┤
│ 搜索: [__________]  需求: [全部▼]  状态: [全部▼]    │
│ 日期: [____] - [____]  [搜索]  [重置]               │
├──────┬──────┬─────┬────────┬───────┬───────┬─────┤
│ 选择  │ 姓名 │ 电话 │ 单位   │ 需求  │ 状态  │ 操作 │
├──────┼──────┼─────┼────────┼───────┼───────┼─────┤
│ □    │ 张三 │138..│ 某某公司│AI课程│ 未回复│ 详情 │
│ □    │ 李四 │139..│ XX学校 │师资培训│已回复│ 详情 │
└──────┴──────┴─────┴────────┴───────┴───────┴─────┘
│ 批量操作: [标记已回复] [标记未回复] [删除]          │
│                        [< 1 2 3 ... 10 >]           │
└─────────────────────────────────────────────────────┘
```

### 4. 详情弹窗

功能：
- 显示完整咨询信息
- 拨打电话（tel:链接）
- 复制联系方式
- 切换处理状态
- 添加/编辑回复备注
- 自动记录回复时间

## 需求类型选项

与表单保持一致：

- AI课程入校
- AI师资培训与认证
- AI研学
- 生态产品联盟
- 政企AI赋能培训
- OPC生态
- 智创专项服务
- 不良资产盘活
- AI党建业务
- 其他

## 实现文件清单

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/app/api/contact/submit/route.ts` | 表单提交 API |
| `src/app/api/admin/consultations/route.ts` | 咨询列表 API |
| `src/app/api/admin/consultations/[id]/route.ts` | 单条记录 API |
| `src/app/api/admin/consultations/batch/route.ts` | 批量操作 API |
| `src/app/api/admin/consultations/export/route.ts` | 导出 API |

### 修改文件

| 文件 | 修改内容 |
|------|----------|
| `prisma/schema.prisma` | 添加 repliedAt, replyNotes, updatedAt 字段 |
| `src/components/Header.tsx` | 修改链接为 /contact#form |
| `src/components/ContactPageClient.tsx` | 表单提交逻辑 + 微信二维码 |
| `src/app/admin/page.tsx` | 添加咨询管理菜单 |
| `src/lib/data.ts` | 添加咨询相关数据加载函数 |

## 安全考虑

1. **防刷验证：** 添加基于 IP 的提交频率限制
2. **输入验证：** 严格验证所有输入字段
3. **XSS 防护：** 对用户输入进行转义
4. **CSRF 防护：** 使用现有的 admin 认证机制

## 测试要点

1. 表单验证（必填项、格式验证）
2. 提交成功后显示正确消息
3. 后台列表正确显示数据
4. 搜索和筛选功能正常
5. 标记已处理/未处理正常
6. 回复备注保存和显示
7. 批量操作正常
8. 导出 CSV 数据正确
9. Header 和浮动按钮跳转正确
10. 微信二维码正确显示

## 部署步骤

1. 修改 schema.prisma
2. 运行 `npx prisma migrate dev --name add_consultation_fields`
3. 运行 `npx prisma generate`
4. 部署代码
5. 在生产环境运行 `npx prisma migrate deploy`
