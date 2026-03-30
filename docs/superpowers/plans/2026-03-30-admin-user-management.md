# 管理员账号管理模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-step. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为后台管理系统添加管理员账号管理功能，支持多管理员账号的创建、编辑、删除和密码重置。

**Architecture:** 采用 Next.js App Router 架构，API Routes 使用 Prisma ORM 访问 PostgreSQL 数据库，前端使用 React Server Components 和 Client Components。复用现有的 `AdminUser` Prisma 模型，无需数据库迁移。

**Tech Stack:** Next.js 15, Prisma, PostgreSQL, bcryptjs, TypeScript, Tailwind CSS

---

## 文件结构概览

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx              # 修改：添加 UsersEditor 组件、更新登录界面、添加导航项
│   └── api/
│       └── admin/
│           └── users/
│               ├── route.ts      # 新建：GET (列表), POST (创建)
│               ├── [id]/
│               │   ├── route.ts  # 新建：PUT (更新), DELETE (删除)
│               │   └── password/
│               │       └── route.ts # 新建：POST (重置密码)
```

---

## Task 1: 创建用户列表 API (GET /api/admin/users)

**Files:**
- Create: `src/app/api/admin/users/route.ts`

- [ ] **Step 1: 创建 API 路由文件**

```typescript
// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

/**
 * GET /api/admin/users
 * 获取所有管理员列表
 */
export async function GET(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[API Error] GET /admin/users:", error);
    return NextResponse.json({ error: "加载数据失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 验证 API 可访问**

启动开发服务器：`npm run dev`

使用 curl 测试（需要先登录获取 token）：
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

预期：返回包含 `users` 数组的 JSON 响应

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/users/route.ts
git commit -m "feat: add GET /api/admin/users endpoint"
```

---

## Task 2: 创建用户创建 API (POST /api/admin/users)

**Files:**
- Modify: `src/app/api/admin/users/route.ts`

- [ ] **Step 1: 添加 POST 处理函数**

在 `src/app/api/admin/users/route.ts` 文件末尾添加：

```typescript
import bcrypt from "bcryptjs";

/**
 * 验证创建用户请求体
 */
function validateCreateUserBody(body: unknown): body is { username: string; password: string; name?: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { username, password } = body as Record<string, unknown>;
  return typeof username === "string" && username.length > 0 &&
         typeof password === "string" && password.length > 0;
}

/**
 * POST /api/admin/users
 * 创建新管理员
 */
export async function POST(request: NextRequest) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 输入验证
    if (!validateCreateUserBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    const { username, password, name } = body;

    // 检查用户名是否已存在
    const existing = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json({ error: "用户名已存在" }, { status: 409 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.adminUser.create({
      data: {
        username,
        password: hashedPassword,
        name: name || username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[API Error] POST /admin/users:", error);
    return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 测试创建用户**

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","name":"测试用户"}'
```

预期：返回 201 状态码和创建的用户信息

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/users/route.ts
git commit -m "feat: add POST /api/admin/users endpoint"
```

---

## Task 3: 创建用户更新 API (PUT /api/admin/users/[id])

**Files:**
- Create: `src/app/api/admin/users/[id]/route.ts`

- [ ] **Step 1: 创建动态路由文件**

```typescript
// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";
import { parseAuthToken } from "@/lib/auth";

interface RouteContext {
  params: { id: string };
}

/**
 * 验证更新用户请求体
 */
function validateUpdateUserBody(body: unknown): body is { name?: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { name } = body as Record<string, unknown>;
  // name 是可选的，但如果存在必须是字符串
  return name === undefined || typeof name === "string";
}

/**
 * PUT /api/admin/users/[id]
 * 更新管理员信息（仅支持修改显示名称）
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const body = await request.json();

    // 输入验证
    if (!validateUpdateUserBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    // 检查用户是否存在
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 更新用户
    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[API Error] PUT /admin/users/[id]:", error);
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id]
 * 删除管理员
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = context.params;

    // 获取当前用户 ID
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.slice(7) || "";
    const currentUserId = parseAuthToken(token);

    // 检查是否尝试删除自己
    if (currentUserId === id) {
      return NextResponse.json({ error: "不能删除当前登录的账号" }, { status: 400 });
    }

    // 检查用户是否存在
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 检查是否是最后一个管理员
    const count = await prisma.adminUser.count();
    if (count <= 1) {
      return NextResponse.json({ error: "不能删除最后一个管理员账号" }, { status: 400 });
    }

    // 删除用户
    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/users/[id]:", error);
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 测试更新和删除**

```bash
# 测试更新
curl -X PUT http://localhost:3000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"新名称"}'

# 测试删除（不能删除自己）
curl -X DELETE http://localhost:3000/api/admin/users/OTHER_USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/users/[id]/route.ts
git commit -m "feat: add PUT/DELETE /api/admin/users/[id] endpoints"
```

---

## Task 4: 创建密码重置 API (POST /api/admin/users/[id]/password)

**Files:**
- Create: `src/app/api/admin/users/[id]/password/route.ts`

- [ ] **Step 1: 创建密码重置路由**

```typescript
// src/app/api/admin/users/[id]/password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface RouteContext {
  params: { id: string };
}

/**
 * 验证密码重置请求体
 */
function validatePasswordBody(body: unknown): body is { password: string } {
  if (!body || typeof body !== "object") {
    return false;
  }
  const { password } = body as Record<string, unknown>;
  return typeof password === "string" && password.length > 0;
}

/**
 * POST /api/admin/users/[id]/password
 * 重置管理员密码
 */
export async function POST(request: NextRequest, context: RouteContext) {
  // 认证检查
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const body = await request.json();

    // 输入验证
    if (!validatePasswordBody(body)) {
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
    }

    // 检查用户是否存在
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 更新密码
    await prisma.adminUser.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /admin/users/[id]/password:", error);
    return NextResponse.json({ error: "重置密码失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 测试密码重置**

```bash
curl -X POST http://localhost:3000/api/admin/users/USER_ID/password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password":"newpassword123"}'
```

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/users/[id]/password/route.ts
git commit -m "feat: add POST /api/admin/users/[id]/password endpoint"
```

---

## Task 5: 更新登录界面支持用户名输入

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 修改状态声明**

找到 `const [password, setPassword] = useState("");` （约第 1742 行），在其上方添加：

```typescript
const [username, setUsername] = useState("admin");
```

- [ ] **Step 2: 修改登录请求**

找到 `handleLogin` 函数中的 `body: JSON.stringify({ password })` （约第 1773 行），修改为：

```typescript
body: JSON.stringify({ username, password }),
```

- [ ] **Step 3: 修改登录表单**

找到登录表单的 `<div className="mb-4">` 部分（约第 1901 行），替换为：

```tsx
<div className="mb-4">
  <input
    type="text"
    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent mb-3"
    placeholder="请输入用户名"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
  />
  <input
    type="password"
    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent"
    placeholder="请输入密码"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
  />
</div>
```

- [ ] **Step 4: 修改登录提示文字**

找到 `请输入管理密码登录` （约第 1899 行），修改为：

```tsx
<p className="text-sm text-gray-500 mt-1">请输入用户名和密码登录</p>
```

- [ ] **Step 5: 修改退出逻辑**

找到 `handleLogout` 函数中的 `setPassword("");` （约第 1793 行），修改为：

```typescript
setUsername("admin");
setPassword("");
```

- [ ] **Step 6: 修改登录按钮禁用条件**

找到 `disabled={loginLoading || !password}` （约第 1914 行），修改为：

```tsx
disabled={loginLoading || !username || !password}
```

- [ ] **Step 7: 测试登录**

1. 访问 http://localhost:3000/admin
2. 输入用户名和密码
3. 点击登录
4. 验证能成功登录

- [ ] **Step 8: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add username input to login form"
```

---

## Task 6: 添加导航项和 CollectionKey 类型

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 更新 CollectionKey 类型**

找到 `type CollectionKey = "home" | "news" | ...` （约第 8 行），在末尾添加 `"users"`：

```typescript
type CollectionKey = "home" | "news" | "about" | "partners" | "cases" | "contact" | "site" | "join" | "consultations" | "users";
```

- [ ] **Step 2: 添加导航项**

找到 `NAV_ITEMS` 数组定义（约第 20 行），在 `"consultations"` 后添加：

```typescript
{ key: "users", label: "账号管理" },
```

- [ ] **Step 3: 测试导航**

刷新页面，验证侧边栏出现"账号管理"选项

- [ ] **Step 4: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add users navigation item"
```

---

## Task 7: 创建 UsersEditor 组件

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 定义用户数据类型**

在文件顶部的 `interface SocialLink` 之后（约第 18 行）添加：

```typescript
interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  role: string;
  createdAt: string;
}
```

- [ ] **Step 2: 创建 UsersEditor 组件**

在 `ConsultationsEditor` 组件定义之后、`export default function AdminPage()` 之前（约第 1737 行），插入以下完整组件：

```tsx
// ─── Users Editor ────────────────────────────────────────────────────────────

function UsersEditor() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const getToken = () => sessionStorage.getItem("admin_token") ?? "";

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 打开添加/编辑弹窗
  const openModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        name: user.name || "",
      });
    } else {
      setEditingUser(null);
      setFormData({ username: "", password: "", name: "" });
    }
    setModalOpen(true);
  };

  // 保存用户
  const saveUser = async () => {
    if (!formData.username || (editingUser ? false : !formData.password)) {
      alert("请填写必填项");
      return;
    }

    try {
      const token = getToken();
      let res;

      if (editingUser) {
        // 更新用户（只允许修改 name）
        res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: formData.name }),
        });
      } else {
        // 创建新用户
        res = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            name: formData.name || formData.username,
          }),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadUsers();
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        alert(`操作失败: ${error.error}`);
      }
    } catch {
      alert("操作失败，请检查网络");
    }
  };

  // 删除用户
  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`确定要删除用户 "${user.name || user.username}" 吗？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.ok) {
        loadUsers();
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        alert(`删除失败: ${error.error}`);
      }
    } catch {
      alert("删除失败，请检查网络");
    }
  };

  // 打开密码重置弹窗
  const openPasswordModal = (user: AdminUser) => {
    setPasswordUser(user);
    setPasswordForm({ password: "", confirmPassword: "" });
    setPasswordModalOpen(true);
  };

  // 重置密码
  const resetPassword = async () => {
    if (!passwordForm.password || !passwordForm.confirmPassword) {
      alert("请填写密码和确认密码");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("两次输入的密码不一致");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${passwordUser!.id}/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ password: passwordForm.password }),
      });

      if (res.ok) {
        setPasswordModalOpen(false);
        alert("密码已重置");
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        alert(`重置失败: ${error.error}`);
      }
    } catch {
      alert("重置失败，请检查网络");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">管理员账号</h3>
          <button
            onClick={() => openModal()}
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 添加账号
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">用户名</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">显示名称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">创建时间</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.name || "-"}</td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openModal(user)}
                      className="text-[#1A3C8A] hover:underline mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => openPasswordModal(user)}
                      className="text-amber-600 hover:underline mr-3"
                    >
                      重置密码
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      className="text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑弹窗 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingUser ? "编辑账号" : "添加账号"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!!editingUser}
                    placeholder="请输入用户名"
                  />
                  {editingUser && (
                    <p className="text-xs text-gray-400 mt-1">用户名不可修改</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    显示名称
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入显示名称"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      初始密码 *
                    </label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="请输入初始密码"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveUser}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 密码重置弹窗 */}
      {passwordModalOpen && passwordUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">重置密码</h3>
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                正在重置用户 <strong>{passwordUser.name || passwordUser.username}</strong> 的密码
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    placeholder="请输入新密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={resetPassword}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: 在 renderEditor 中添加 users 分支**

找到 `renderEditor` 函数中的 switch 语句（约第 1868 行），在 `case "consultations"` 之后添加：

```typescript
case "users":
  return <UsersEditor />;
```

- [ ] **Step 4: 测试 UsersEditor**

1. 访问 http://localhost:3000/admin
2. 登录后点击"账号管理"
3. 验证用户列表正常显示
4. 测试添加、编辑、删除、重置密码功能

- [ ] **Step 5: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add UsersEditor component"
```

---

## Task 8: 移除 users 的保存按钮

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 更新保存按钮条件**

找到 `{activeSection !== "cases" && (` （约第 2002 行），修改为：

```tsx
{activeSection !== "cases" && activeSection !== "users" && (
```

- [ ] **Step 2: 验证**

访问"账号管理"页面，确认不显示"保存"按钮

- [ ] **Step 3: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "fix: hide save button on users page"
```

---

## Task 9: 完整功能测试

- [ ] **Step 1: 测试登录**

1. 使用不同账号登录
2. 验证用户名和密码都正确才能登录
3. 验证错误的用户名或密码会显示错误

- [ ] **Step 2: 测试用户管理**

1. 创建新用户
2. 使用新用户登录
3. 编辑用户显示名称
4. 重置用户密码
5. 尝试删除自己（应该被拒绝）
6. 尝试删除最后一个管理员（应该被拒绝）
7. 删除其他用户

- [ ] **Step 3: 测试安全规则**

1. 未登录访问 `/api/admin/users`（应该返回 401）
2. 使用错误 token 访问 API（应该返回 401）

- [ ] **Step 4: 测试边界情况**

1. 创建重复用户名（应该返回 409）
2. 编辑不存在的用户 ID（应该返回 404）
3. 删除不存在的用户 ID（应该返回 404）

- [ ] **Step 5: 最终提交**

```bash
git commit --allow-empty -m "test: complete admin user management testing"
```

---

## 完成检查清单

- [ ] 所有 API 端点正常工作
- [ ] 登录界面支持用户名输入
- [ ] 导航栏显示"账号管理"选项
- [ ] 用户列表正确显示
- [ ] 可以添加新用户
- [ ] 可以编辑用户显示名称
- [ ] 可以重置用户密码
- [ ] 不能删除当前登录账号
- [ ] 不能删除最后一个管理员
- [ ] 不能创建重复用户名
