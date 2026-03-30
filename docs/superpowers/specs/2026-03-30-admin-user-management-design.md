# 管理员账号管理模块设计文档

**日期**: 2026-03-30
**状态**: 设计阶段

## 概述

为后台管理系统添加管理员账号管理功能，支持多管理员账号的创建、编辑、删除和密码重置。

## 背景

当前系统只有一个默认的管理员账号（username: 'admin'），需要支持多个管理员账号同时管理后台。

## 需求

- 支持创建多个管理员账号（预计 5-10 个）
- 所有管理员权限相同
- 账号相对固定，不频繁变动
- 可通过后台界面管理账号

## 设计

### 1. 数据模型

复用现有的 `AdminUser` Prisma 模型（无需修改）：

```prisma
model AdminUser {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  name      String?
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. API 端点

**权限说明**：所有已登录的管理员具有相同权限，可执行所有操作（受安全规则限制）。

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/admin/users` | GET | 获取所有管理员列表 |
| `/api/admin/users` | POST | 创建新管理员 |
| `/api/admin/users/[id]` | PUT | 更新管理员信息（用户名不可修改） |
| `/api/admin/users/[id]` | DELETE | 删除管理员 |
| `/api/admin/users/[id]/password` | POST | 重置密码 |

### 3. 前端组件

**导航项**（位于 `src/app/admin/page.tsx` 中的 `NAV_ITEMS` 常量）：
- 添加 `{ key: "users", label: "账号管理" }`

**UsersEditor 组件**：
- 表格展示：用户名、显示名称、创建时间、操作
- 添加按钮：打开添加弹窗
- 编辑按钮：打开编辑弹窗（用户名不可修改）
- 删除按钮：删除账号（带确认）
- 重置密码按钮：打开密码重置弹窗

**登录界面更新**（位于 `src/app/admin/page.tsx`）：
- 当前登录表单只有一个密码输入框（用户名默认为 'admin'）
- 修改：添加用户名输入框，支持输入任意管理员账号
- 登录逻辑保持不变：用户名 + 密码验证，生成 token 存入 sessionStorage

### 4. 安全规则

1. **删除保护**：
   - 不允许删除最后一个管理员账号
   - 不允许删除当前登录的账号

2. **唯一性约束**：
   - 用户名必须唯一
   - 创建时检查用户名是否已存在

3. **密码安全**：
   - 使用 bcrypt 加密存储
   - 重置密码时需要确认输入

### 5. 文件结构

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx              # 添加 UsersEditor 和登录界面更新
│   └── api/
│       └── admin/
│           └── users/
│               ├── route.ts      # GET (列表), POST (创建)
│               ├── [id]/
│               │   ├── route.ts  # PUT (更新), DELETE (删除)
│               │   └── password/
│               │       └── route.ts # POST (重置密码)
└── components/
    └── UsersEditor.tsx           # 新组件（可选，也可内联到 page.tsx）
```

## 实施步骤

1. 创建 API 路由（users CRUD + password reset）
2. 在 `src/app/admin/page.tsx` 中添加 UsersEditor 组件和导航项
3. 更新登录界面支持用户名输入
4. 确保现有 AdminUser 数据可以正常使用（无需迁移）
5. 测试所有功能
6. 部署

## 设计决策

- **密码复杂度**：暂不强制校验，仅要求非空（后续可扩展）
- **操作日志**：暂不记录，保持功能简单（后续可扩展）
- **角色权限**：所有管理员权限相同，role 字段保留以备未来扩展
