# 专家团队管理系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 为 AI 师资培训页面添加后台专家团队管理功能，支持添加、编辑、删除、排序和头像上传。

**架构:** 使用 Prisma + PostgreSQL 存储专家数据，后台使用专用 API 路由进行 CRUD 操作，前端通过服务端组件获取数据。

**技术栈:** Next.js 15 (App Router), Prisma, PostgreSQL, Tailwind CSS

---

## 文件结构

```
prisma/
├── schema.prisma                    # 修改：添加 Expert 模型

src/app/api/admin/experts/
├── route.ts                         # 新建：专家列表 API (GET, POST)
└── [id]/
    └── route.ts                     # 新建：单个专家 API (PUT, DELETE)

src/app/api/public/experts/
└── route.ts                         # 新建：公开读取 API (GET)

src/app/admin/page.tsx               # 修改：添加专家管理菜单和编辑器

src/app/services/teacher-training/
└── page.tsx                         # 修改：从 API 读取专家数据
```

---

## Task 1: 添加 Prisma 数据模型

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: 在 schema.prisma 末尾添加 Expert 模型**

在 `model ContactSubmission` 后添加：

```prisma
model Expert {
  id        String   @id @default(cuid())
  name      String
  title     String
  org       String
  focus     String
  avatar    String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
}
```

- [ ] **Step 2: 生成并运行数据库迁移**

```bash
npx prisma migrate dev --name add_expert_model
```

预期输出：包含 `add_expert_model` 的迁移文件创建成功

- [ ] **Step 3: 提交**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add Expert model to schema"
```

---

## Task 2: 创建专家列表 API

**Files:**
- Create: `src/app/api/admin/experts/route.ts`

- [ ] **Step 1: 创建专家列表 API 路由文件**

创建 `src/app/api/admin/experts/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

// GET /api/admin/experts - 获取专家列表
export async function GET(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const experts = await prisma.expert.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(experts);
  } catch (error) {
    console.error("[API Error] GET /admin/experts:", error);
    return NextResponse.json({ error: "获取专家列表失败" }, { status: 500 });
  }
}

// POST /api/admin/experts - 创建新专家
export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.name || !body.title || !body.org || !body.focus) {
      return NextResponse.json(
        { error: "缺少必填字段: name, title, org, focus" },
        { status: 400 }
      );
    }

    // 获取当前最大 order 值
    const maxOrderExpert = await prisma.expert.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (maxOrderExpert?.order ?? -1) + 1;

    const expert = await prisma.expert.create({
      data: {
        name: body.name,
        title: body.title,
        org: body.org,
        focus: body.focus,
        avatar: body.avatar || null,
        order: body.order !== undefined ? body.order : nextOrder,
      },
    });

    return NextResponse.json(expert);
  } catch (error) {
    console.error("[API Error] POST /admin/experts:", error);
    return NextResponse.json({ error: "创建专家失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/admin/experts/route.ts
git commit -m "feat: add experts list API"
```

---

## Task 3: 创建单个专家 API

**Files:**
- Create: `src/app/api/admin/experts/[id]/route.ts`

- [ ] **Step 1: 创建单个专家 CRUD API**

创建 `src/app/api/admin/experts/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";

// PUT /api/admin/experts/[id] - 更新专家
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // 验证专家是否存在
    const existing = await prisma.expert.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "专家不存在" }, { status: 404 });
    }

    // 更新专家
    const expert = await prisma.expert.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.org !== undefined && { org: body.org }),
        ...(body.focus !== undefined && { focus: body.focus }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(expert);
  } catch (error) {
    console.error("[API Error] PUT /admin/experts/[id]:", error);
    return NextResponse.json({ error: "更新专家失败" }, { status: 500 });
  }
}

// DELETE /api/admin/experts/[id] - 删除专家
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.expert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/experts/[id]:", error);
    return NextResponse.json({ error: "删除专家失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/admin/experts/[id]/route.ts
git commit -m "feat: add individual expert API"
```

---

## Task 4: 创建公开读取 API

**Files:**
- Create: `src/app/api/public/experts/route.ts`

- [ ] **Step 1: 创建公开专家列表 API**

创建 `src/app/api/public/experts/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/experts - 获取专家列表（公开接口）
export async function GET() {
  try {
    const experts = await prisma.expert.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        title: true,
        org: true,
        focus: true,
        avatar: true,
      },
    });

    // 设置缓存头，减少数据库查询
    return NextResponse.json(experts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[API Error] GET /public/experts:", error);
    return NextResponse.json({ error: "获取专家列表失败" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/public/experts/route.ts
git commit -m "feat: add public experts API"
```

---

## Task 5: 添加后台管理界面

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 在 admin/page.tsx 中添加 experts 到 CollectionKey 类型**

找到 `type CollectionKey` 定义（约第 8 行），修改为：

```typescript
type CollectionKey = "home" | "news" | "about" | "partners" | "cases" | "contact" | "site" | "join" | "consultations" | "users" | "experts";
```

- [ ] **Step 2: 在 NAV_ITEMS 数组中添加专家团队菜单项**

找到 `const NAV_ITEMS` 定义（约第 28 行），在数组末尾添加：

```typescript
{ key: "experts", label: "专家团队" },
```

- [ ] **Step 3: 在 renderEditor 函数的 switch 中添加 experts 分支**

找到 `renderEditor` 函数中的 `switch` 语句，在 `case "users":` 后添加：

```typescript
case "experts":
  return <ExpertsEditor {...props} />;
```

- [ ] **Step 4: 在 UsersEditor 组件后添加 ExpertsEditor 组件**

找到 `// ─── Users Editor ────────────────────────────────────────────────────────────` 部分（约第 1747 行），在 `UsersEditor` 组件定义后、`// ─── Main Admin Page ─────────────────────────────────────────────────────────` 之前添加：

```typescript
// ─── Experts Editor ────────────────────────────────────────────────────────────

interface Expert {
  id: string;
  name: string;
  title: string;
  org: string;
  focus: string;
  avatar: string | null;
  order: number;
}

function ExpertsEditor() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    org: "",
    focus: "",
    avatar: "",
  });

  const getToken = () => sessionStorage.getItem("admin_token") ?? "";

  // 加载专家列表
  const loadExperts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experts", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExperts(data);
      }
    } catch {
      console.error("Failed to load experts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  // 打开添加/编辑弹窗
  const openModal = (expert?: Expert) => {
    if (expert) {
      setEditingExpert(expert);
      setFormData({
        name: expert.name,
        title: expert.title,
        org: expert.org,
        focus: expert.focus,
        avatar: expert.avatar || "",
      });
    } else {
      setEditingExpert(null);
      setFormData({ name: "", title: "", org: "", focus: "", avatar: "" });
    }
    setModalOpen(true);
  };

  // 保存专家
  const saveExpert = async () => {
    if (!formData.name || !formData.title || !formData.org || !formData.focus) {
      alert("请填写所有必填项");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      let res;

      if (editingExpert) {
        // 更新
        res = await fetch(`/api/admin/experts/${editingExpert.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // 创建
        res = await fetch("/api/admin/experts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadExperts();
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        alert(`操作失败: ${error.error}`);
      }
    } catch {
      alert("操作失败，请检查网络");
    } finally {
      setSaving(false);
    }
  };

  // 删除专家
  const deleteExpert = async (expert: Expert) => {
    if (!confirm(`确定要删除专家 "${expert.name}" 吗？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/experts/${expert.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.ok) {
        loadExperts();
      } else {
        alert("删除失败");
      }
    } catch {
      alert("删除失败，请检查网络");
    }
  };

  // 上移
  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newExperts = [...experts];
    [newExperts[index - 1], newExperts[index]] = [newExperts[index], newExperts[index - 1]];

    // 更新 order 值
    try {
      const token = getToken();
      await Promise.all([
        fetch(`/api/admin/experts/${newExperts[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index }),
        }),
        fetch(`/api/admin/experts/${newExperts[index - 1].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index - 1 }),
        }),
      ]);
      loadExperts();
    } catch {
      alert("排序失败");
    }
  };

  // 下移
  const moveDown = async (index: number) => {
    if (index === experts.length - 1) return;
    const newExperts = [...experts];
    [newExperts[index], newExperts[index + 1]] = [newExperts[index + 1], newExperts[index]];

    // 更新 order 值
    try {
      const token = getToken();
      await Promise.all([
        fetch(`/api/admin/experts/${newExperts[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index }),
        }),
        fetch(`/api/admin/experts/${newExperts[index + 1].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index + 1 }),
        }),
      ]);
      loadExperts();
    } catch {
      alert("排序失败");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">专家团队</h3>
          <button
            onClick={() => openModal()}
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 添加专家
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">头像</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">姓名</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">职称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">机构</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">研究方向</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {experts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    暂无专家，点击上方按钮添加
                  </td>
                </tr>
              ) : (
                experts.map((expert, index) => (
                  <tr key={expert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {expert.avatar ? (
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">无</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{expert.name}</td>
                    <td className="py-3 px-4">{expert.title}</td>
                    <td className="py-3 px-4">{expert.org}</td>
                    <td className="py-3 px-4">{expert.focus}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30 mr-2"
                        title="上移"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === experts.length - 1}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30 mr-3"
                        title="下移"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => openModal(expert)}
                        className="text-[#1A3C8A] hover:underline mr-3"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => deleteExpert(expert)}
                        className="text-red-500 hover:underline"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
                  {editingExpert ? "编辑专家" : "添加专家"}
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
                    姓名 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    职称 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入职称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    机构 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    placeholder="请输入机构"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    研究方向 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.focus}
                    onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                    placeholder="请输入研究方向"
                  />
                </div>

                <div>
                  <ImageButton
                    label="头像"
                    value={formData.avatar}
                    onChange={(v) => setFormData({ ...formData, avatar: v })}
                    type="experts"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveExpert}
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "保存中..." : "保存"}
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

- [ ] **Step 5: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add experts admin interface"
```

---

## Task 6: 修改前端页面使用 API 数据

**Files:**
- Modify: `src/app/services/teacher-training/page.tsx`

由于该页面是 `"use client"` 组件，需要使用 `useEffect` 客户端获取数据。

- [ ] **Step 1: 添加 useState 和 useEffect 导入**

在文件顶部找到 `"use client";` 之后的 import 部分，添加（如果不存在）：

```typescript
import { useState, useEffect } from "react";
```

- [ ] **Step 2: 删除硬编码的 experts 数组**

找到 `const experts = [...]` 定义（约第 33 行），删除整个数组定义（约 26 行）。

- [ ] **Step 3: 在组件内添加状态和获取逻辑**

在 `export default function TeacherTrainingPage() {` 之后添加：

```typescript
  const [experts, setExperts] = useState<Array<{
    id: string;
    name: string;
    title: string;
    org: string;
    focus: string;
    avatar: string | null;
  }>>([]);

  useEffect(() => {
    fetch("/api/public/experts")
      .then((res) => res.json())
      .then((data) => setExperts(data))
      .catch(() => setExperts([]));
  }, []);
```

- [ ] **Step 4: 更新头像渲染逻辑**

找到头像占位符代码（约第 314 行），修改为：

```typescript
{expert.avatar ? (
  <img
    src={expert.avatar}
    alt={expert.name}
    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
  />
) : (
  <div className="w-20 h-20 bg-gradient-to-br from-[#1565C0]/20 to-[#D4A843]/20 rounded-full flex items-center justify-center mx-auto mb-4">
    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
)}
```

- [ ] **Step 5: 提交**

```bash
git add src/app/services/teacher-training/page.tsx
git commit -m "feat: fetch experts from API in teacher-training page"
```

---

## Task 7: 迁移初始数据

**Files:**
- None (data migration via API or SQL)

- [ ] **Step 1: 在后台添加初始专家数据**

访问 `/admin`，进入"专家团队"页面，添加以下初始数据：

| 姓名 | 职称 | 机构 | 研究方向 |
|------|------|------|----------|
| 张教授 | 教育部长江学者特聘教授 | 某985高校人工智能学院 | 人工智能教育、计算机科学教育 |
| 李教授 | 博士生导师 | 上海交通大学 | AI教育技术、智能教学系统 |
| 王教授 | 教育信息化专家 | 华东师范大学 | 教育数字化转型、AI教师培训 |
| 陈教授 | 高级研究员 | 中国科学院计算技术研究所 | 青少年AI教育、课程标准研究 |

- [ ] **Step 2: 验证前端页面显示**

访问 `/services/teacher-training`，确认专家团队正确显示。

---

## Task 8: 测试与验证

- [ ] **Step 1: 测试后台功能**

- 创建新专家
- 编辑专家信息
- 上传专家头像
- 上移/下移排序
- 删除专家

- [ ] **Step 2: 测试前端显示**

- 验证专家列表按 order 排序
- 验证头像正确显示
- 验证无头像时显示占位符

- [ ] **Step 3: 测试权限**

- 验证未登录无法访问后台 API
- 验证公开 API 无需认证

---

## 可选：添加数据库种子数据

如果希望通过 Prisma seed 添加初始数据，可以创建 `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.expert.createMany({
    data: [
      {
        name: "张教授",
        title: "教育部长江学者特聘教授",
        org: "某985高校人工智能学院",
        focus: "人工智能教育、计算机科学教育",
        order: 0,
      },
      {
        name: "李教授",
        title: "博士生导师",
        org: "上海交通大学",
        focus: "AI教育技术、智能教学系统",
        order: 1,
      },
      {
        name: "王教授",
        title: "教育信息化专家",
        org: "华东师范大学",
        focus: "教育数字化转型、AI教师培训",
        order: 2,
      },
      {
        name: "陈教授",
        title: "高级研究员",
        org: "中国科学院计算技术研究所",
        focus: "青少年AI教育、课程标准研究",
        order: 3,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

然后运行: `npx prisma db seed`
