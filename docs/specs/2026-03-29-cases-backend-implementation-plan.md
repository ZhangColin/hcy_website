# 案例与成果后台管理系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将前台"案例与成果"页面从硬编码迁移到数据库管理，支持后台维护学校和赛事数据，支持图片上传。

**Architecture:** 扩展现有 Prisma 模型，新增 RESTful API 接口，修改前台页面从 API 获取数据，扩展后台管理界面支持 CRUD 和图片上传。

**Tech Stack:** Next.js 15 (App Router), Prisma, PostgreSQL, TypeScript, Tailwind CSS

---

## 文件结构

### 新建文件
- `src/app/api/cases/route.ts` - 前台数据接口
- `src/app/api/admin/cases/schools/route.ts` - 学校案例列表和新增
- `src/app/api/admin/cases/schools/[id]/route.ts` - 单个学校案例 CRUD
- `src/app/api/admin/cases/competitions/route.ts` - 赛事荣誉列表和新增
- `src/app/api/admin/cases/competitions/[id]/route.ts` - 单个赛事荣誉 CRUD
- `src/app/api/admin/cases/reorder/route.ts` - 批量排序接口
- `scripts/seed-cases.ts` - 数据迁移脚本

### 修改文件
- `prisma/schema.prisma` - 扩展 SchoolCase 和 CompetitionHonor 模型
- `src/app/cases/page.tsx` - 改为从 API 获取数据
- `src/app/admin/page.tsx` - 扩展 CasesEditor 组件
- `src/app/api/admin/[collection]/route.ts` - 更新字段白名单

---

## Task 1: 更新数据库 Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: 备份当前 schema**

```bash
cp prisma/schema.prisma prisma/schema.prisma.backup
```

- [ ] **Step 2: 修改 SchoolCase 模型**

在 `prisma/schema.prisma` 中，找到 `model SchoolCase`，替换为:

```prisma
model SchoolCase {
  id          String   @id @default(cuid())
  name        String
  region      String
  grade       String   @default("[]")  // JSON: ["小学", "初中", "高中"]
  abbr        String   @default("")
  partnership String   @default("")
  results     String   @default("")
  color       String   @default("from-[#1A3C8A] to-[#2B6CB0]")
  coverImage  String?
  schoolLogo  String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 3: 修改 CompetitionHonor 模型**

在 `prisma/schema.prisma` 中，找到 `model CompetitionHonor`，替换为:

```prisma
model CompetitionHonor {
  id           String   @id @default(cuid())
  title        String
  level        String
  year         String
  achievements String   @default("")
  image        String?
  order        Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

- [ ] **Step 4: 生成并运行迁移**

```bash
npx prisma migrate dev --name update_cases_and_competitions
```

预期输出: Migration successful, applied to database

- [ ] **Step 5: 重新生成 Prisma Client**

```bash
npx prisma generate
```

预期输出: Prisma Client generated

- [ ] **Step 6: 提交**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: extend SchoolCase and CompetitionHonor models with new fields"
```

---

## Task 2: 创建数据迁移脚本

**Files:**
- Create: `scripts/seed-cases.ts`

- [ ] **Step 1: 创建迁移脚本文件**

创建 `scripts/seed-cases.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 预设颜色渐变选项
const COLOR_PRESETS = [
  "from-[#1A3C8A] to-[#2B6CB0]",
  "from-[#2B6CB0] to-blue-500",
  "from-[#D4A843] to-amber-500",
  "from-purple-600 to-indigo-600",
  "from-teal-600 to-cyan-600",
  "from-rose-500 to-pink-600",
];

async function main() {
  console.log('开始迁移案例和荣誉数据...');

  // 清空现有数据（可选，谨慎使用）
  // await prisma.schoolCase.deleteMany();
  // await prisma.competitionHonor.deleteMany();

  // 学校案例数据
  const schoolCases = [
    {
      name: "北京中学",
      region: "北京",
      grade: JSON.stringify(["初中", "高中"]),
      abbr: "北中",
      partnership: "共建青少年AI创新学院，打造人工智能创新人才培养基地",
      results: "培养学生获全国赛事一等奖12项，AI课程纳入校本必修课",
      color: COLOR_PRESETS[0],
      order: 1,
    },
    {
      name: "上外附中",
      region: "上海",
      grade: JSON.stringify(["初中", "高中"]),
      abbr: "上外",
      partnership: "5年深度合作，AI课程入校全学段覆盖",
      results: "师生满意度98%，学生竞赛获奖率提升200%",
      color: COLOR_PRESETS[1],
      order: 2,
    },
    {
      name: "海亮教育",
      region: "浙江",
      grade: JSON.stringify(["小学", "初中", "高中"]),
      abbr: "海亮",
      partnership: "120所院校签约，集团化AI教育解决方案落地",
      results: "覆盖学生超10万人，教师AI素养认证通过率95%",
      color: COLOR_PRESETS[2],
      order: 3,
    },
    {
      name: "绵阳南山中学",
      region: "其他",
      grade: JSON.stringify(["高中"]),
      abbr: "南山",
      partnership: "AI创客实验室共建，赛事培训一体化服务",
      results: "学生获省级以上奖项8项，学校获评AI教育示范校",
      color: COLOR_PRESETS[3],
      order: 4,
    },
    {
      name: "北京开放大学",
      region: "北京",
      grade: JSON.stringify(["高中"]),
      abbr: "北开",
      partnership: "政企AI赋能培训基地，师资认证考核中心",
      results: "年培训教师500+人次，认证体系获行业认可",
      color: COLOR_PRESETS[4],
      order: 5,
    },
    {
      name: "其他代表院校",
      region: "其他",
      grade: JSON.stringify(["小学", "初中", "高中"]),
      abbr: "更多",
      partnership: "覆盖全国30+省市，70+合作渠道共建AI教育生态",
      results: "累计服务130+所院校，授课1000+课时",
      color: COLOR_PRESETS[5],
      order: 6,
    },
  ];

  // 赛事荣誉数据
  const competitionHonors = [
    {
      title: "Intel AI全球影响力嘉年华",
      level: "国际",
      year: "2023",
      achievements: "全球总冠军",
      order: 1,
    },
    {
      title: "丘成桐中学科学奖",
      level: "国际",
      year: "2024",
      achievements: "全球总冠军",
      order: 2,
    },
    {
      title: "ISEF 国际科学与工程大奖赛",
      level: "国际",
      year: "2024",
      achievements: "全球总冠军",
      order: 3,
    },
    {
      title: "全国青少年人工智能创新挑战赛",
      level: "全国",
      year: "2022-2024",
      achievements: "全国总冠军 x3",
      order: 4,
    },
    {
      title: "全国中小学信息技术创新与实践大赛",
      level: "全国",
      year: "2023-2024",
      achievements: "全国总冠军 x2",
      order: 5,
    },
    {
      title: "世界机器人大赛",
      level: "国际",
      year: "2023",
      achievements: "全国总冠军 x2",
      order: 6,
    },
  ];

  // 插入学校案例
  for (const schoolCase of schoolCases) {
    await prisma.schoolCase.upsert({
      where: { id: `sc-${schoolCase.order}` },
      update: schoolCase,
      create: { ...schoolCase, id: `sc-${schoolCase.order}` },
    });
  }
  console.log(`✓ 学校案例迁移完成 (${schoolCases.length} 条)`);

  // 插入赛事荣誉
  for (const honor of competitionHonors) {
    await prisma.competitionHonor.upsert({
      where: { id: `ch-${honor.order}` },
      update: honor,
      create: { ...honor, id: `ch-${honor.order}` },
    });
  }
  console.log(`✓ 赛事荣誉迁移完成 (${competitionHonors.length} 条)`);

  console.log('数据迁移完成!');
}

main()
  .catch((e) => {
    console.error('迁移失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: 运行迁移脚本**

```bash
npx tsx scripts/seed-cases.ts
```

预期输出:
```
开始迁移案例和荣誉数据...
✓ 学校案例迁移完成 (6 条)
✓ 赛事荣誉迁移完成 (6 条)
数据迁移完成!
```

- [ ] **Step 3: 验证数据已导入**

```bash
npx prisma studio
```

在 Prisma Studio 中检查 SchoolCase 和 CompetitionHonor 表是否有数据。

- [ ] **Step 4: 提交**

```bash
git add scripts/seed-cases.ts
git commit -m "feat: add data migration script for cases and competitions"
```

---

## Task 3: 更新 API 字段白名单

**Files:**
- Modify: `src/app/api/admin/[collection]/route.ts`

- [ ] **Step 1: 更新字段白名单**

在 `src/app/api/admin/[collection]/route.ts` 中，找到 `FIELD_WHITELISTS` 定义，更新 `schoolCase` 和 `competitionHonor`:

```typescript
const FIELD_WHITELISTS = {
  // ... 其他字段保持不变 ...
  schoolCase: ["name", "region", "grade", "abbr", "partnership", "results", "color", "coverImage", "schoolLogo", "order"],
  competitionHonor: ["title", "level", "year", "achievements", "image", "order"],
  // ... 其他字段保持不变 ...
} as const;
```

- [ ] **Step 2: 测试 API 仍能正常工作**

```bash
npm run dev
```

访问 http://localhost:3000/api/admin/cases 确认返回正确数据。

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/[collection]/route.ts
git commit -m "fix: update field whitelist for extended cases models"
```

---

## Task 4: 创建前台数据 API

**Files:**
- Create: `src/app/api/cases/route.ts`

- [ ] **Step 1: 创建前台数据接口**

创建 `src/app/api/cases/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [schoolCases, competitionHonors] = await Promise.all([
      prisma.schoolCase.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.competitionHonor.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);

    // 转换 grade 从 JSON 字符串到数组
    const formattedCases = schoolCases.map((c) => ({
      ...c,
      grade: JSON.parse(c.grade || "[]"),
    }));

    return NextResponse.json({
      schoolCases: formattedCases,
      competitionHonors,
    });
  } catch (error) {
    console.error("[API Error] GET /cases:", error);
    return NextResponse.json(
      { error: "加载数据失败" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 测试前台 API**

```bash
curl http://localhost:3000/api/cases
```

预期返回包含 schoolCases 和 competitionHonors 的 JSON。

- [ ] **Step 3: 提交**

```bash
git add src/app/api/cases/route.ts
git commit -m "feat: add public API for cases and competitions data"
```

---

## Task 5: 创建学校案例 CRUD API

**Files:**
- Create: `src/app/api/admin/cases/schools/route.ts`
- Create: `src/app/api/admin/cases/schools/[id]/route.ts`

- [ ] **Step 1: 创建学校案例列表和新增接口**

创建 `src/app/api/admin/cases/schools/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取所有学校案例
export async function GET(request: NextRequest) {
  try {
    const cases = await prisma.schoolCase.findMany({
      orderBy: { order: 'asc' },
    });

    // 转换 grade 从 JSON 字符串到数组
    const formattedCases = cases.map((c) => ({
      ...c,
      grade: JSON.parse(c.grade || "[]"),
    }));

    return NextResponse.json({ schoolCases: formattedCases });
  } catch (error) {
    console.error("[API Error] GET /admin/cases/schools:", error);
    return NextResponse.json(
      { error: "加载失败" },
      { status: 500 }
    );
  }
}

// POST - 新增学校案例
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必需字段
    if (!body.name || !body.region) {
      return NextResponse.json(
        { error: "缺少必需字段: name, region" },
        { status: 400 }
      );
    }

    // 转换 grade 数组到 JSON 字符串
    const gradeJson = Array.isArray(body.grade)
      ? JSON.stringify(body.grade)
      : body.grade || "[]";

    // 获取最大 order 值
    const maxOrder = await prisma.schoolCase.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newCase = await prisma.schoolCase.create({
      data: {
        name: body.name,
        region: body.region,
        grade: gradeJson,
        abbr: body.abbr || "",
        partnership: body.partnership || "",
        results: body.results || "",
        color: body.color || "from-[#1A3C8A] to-[#2B6CB0]",
        coverImage: body.coverImage || null,
        schoolLogo: body.schoolLogo || null,
        order: (maxOrder?.order ?? 0) + 1,
      },
    });

    return NextResponse.json({
      schoolCase: { ...newCase, grade: JSON.parse(newCase.grade) }
    });
  } catch (error) {
    console.error("[API Error] POST /admin/cases/schools:", error);
    return NextResponse.json(
      { error: "创建失败" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建单个学校案例 CRUD 接口**

创建 `src/app/api/admin/cases/schools/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - 更新学校案例
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 转换 grade 数组到 JSON 字符串
    const gradeJson = Array.isArray(body.grade)
      ? JSON.stringify(body.grade)
      : body.grade;

    const updated = await prisma.schoolCase.update({
      where: { id },
      data: {
        name: body.name,
        region: body.region,
        grade: gradeJson,
        abbr: body.abbr,
        partnership: body.partnership,
        results: body.results,
        color: body.color,
        coverImage: body.coverImage,
        schoolLogo: body.schoolLogo,
        order: body.order,
      },
    });

    return NextResponse.json({
      schoolCase: { ...updated, grade: JSON.parse(updated.grade) }
    });
  } catch (error) {
    console.error("[API Error] PUT /admin/cases/schools/[id]:", error);
    return NextResponse.json(
      { error: "更新失败" },
      { status: 500 }
    );
  }
}

// DELETE - 删除学校案例
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.schoolCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/cases/schools/[id]:", error);
    return NextResponse.json(
      { error: "删除失败" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: 测试 API**

```bash
# 测试 GET
curl http://localhost:3000/api/admin/cases/schools

# 测试 POST (需要带 token)
curl -X POST http://localhost:3000/api/admin/cases/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"测试学校","region":"北京","grade":["小学"],"abbr":"测试"}'
```

- [ ] **Step 4: 提交**

```bash
git add src/app/api/admin/cases/schools/
git commit -m "feat: add CRUD API for school cases"
```

---

## Task 6: 创建赛事荣誉 CRUD API

**Files:**
- Create: `src/app/api/admin/cases/competitions/route.ts`
- Create: `src/app/api/admin/cases/competitions/[id]/route.ts`

- [ ] **Step 1: 创建赛事荣誉列表和新增接口**

创建 `src/app/api/admin/cases/competitions/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取所有赛事荣誉
export async function GET(request: NextRequest) {
  try {
    const honors = await prisma.competitionHonor.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ competitionHonors: honors });
  } catch (error) {
    console.error("[API Error] GET /admin/cases/competitions:", error);
    return NextResponse.json(
      { error: "加载失败" },
      { status: 500 }
    );
  }
}

// POST - 新增赛事荣誉
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必需字段
    if (!body.title || !body.level || !body.year) {
      return NextResponse.json(
        { error: "缺少必需字段: title, level, year" },
        { status: 400 }
      );
    }

    // 获取最大 order 值
    const maxOrder = await prisma.competitionHonor.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newHonor = await prisma.competitionHonor.create({
      data: {
        title: body.title,
        level: body.level,
        year: body.year,
        achievements: body.achievements || "",
        image: body.image || null,
        order: (maxOrder?.order ?? 0) + 1,
      },
    });

    return NextResponse.json({ competitionHonor: newHonor });
  } catch (error) {
    console.error("[API Error] POST /admin/cases/competitions:", error);
    return NextResponse.json(
      { error: "创建失败" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建单个赛事荣誉 CRUD 接口**

创建 `src/app/api/admin/cases/competitions/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - 更新赛事荣誉
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.competitionHonor.update({
      where: { id },
      data: {
        title: body.title,
        level: body.level,
        year: body.year,
        achievements: body.achievements,
        image: body.image,
        order: body.order,
      },
    });

    return NextResponse.json({ competitionHonor: updated });
  } catch (error) {
    console.error("[API Error] PUT /admin/cases/competitions/[id]:", error);
    return NextResponse.json(
      { error: "更新失败" },
      { status: 500 }
    );
  }
}

// DELETE - 删除赛事荣誉
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.competitionHonor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] DELETE /admin/cases/competitions/[id]:", error);
    return NextResponse.json(
      { error: "删除失败" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: 测试 API**

```bash
# 测试 GET
curl http://localhost:3000/api/admin/cases/competitions
```

- [ ] **Step 4: 提交**

```bash
git add src/app/api/admin/cases/competitions/
git commit -m "feat: add CRUD API for competition honors"
```

---

## Task 7: 创建批量排序接口

**Files:**
- Create: `src/app/api/admin/cases/reorder/route.ts`

- [ ] **Step 1: 创建批量排序接口**

创建 `src/app/api/admin/cases/reorder/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.schoolCases || !Array.isArray(body.schoolCases)) {
      return NextResponse.json(
        { error: "缺少 schoolCases 数组" },
        { status: 400 }
      );
    }

    // 批量更新学校案例排序
    for (const item of body.schoolCases) {
      if (item.id && typeof item.order === 'number') {
        await prisma.schoolCase.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    }

    // 批量更新赛事荣誉排序
    if (body.competitionHonors && Array.isArray(body.competitionHonors)) {
      for (const item of body.competitionHonors) {
        if (item.id && typeof item.order === 'number') {
          await prisma.competitionHonor.update({
            where: { id: item.id },
            data: { order: item.order },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] POST /admin/cases/reorder:", error);
    return NextResponse.json(
      { error: "排序失败" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/admin/cases/reorder/
git commit -m "feat: add batch reorder API for cases and competitions"
```

---

## Task 8: 修改前台页面使用 API 数据

**Files:**
- Modify: `src/app/cases/page.tsx`

- [ ] **Step 1: 修改数据获取方式**

在 `src/app/cases/page.tsx` 顶部添加数据获取函数，删除硬编码数据：

找到文件中的 `const schoolCases: SchoolCase[] = [...]` 等硬编码数据（约第43-163行），替换为：

```typescript
// 从 API 获取数据
async function fetchCasesData() {
  try {
    const res = await fetch('/api/cases', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch cases:', error);
    return { schoolCases: [], competitionHonors: [] };
  }
}

const casesData = await fetchCasesData();
const schoolCases: SchoolCase[] = casesData.schoolCases || [];
const competitions: Competition[] = casesData.competitionHonors || [];
```

- [ ] **Step 2: 修改 SchoolCase 类型定义**

更新 `SchoolCase` 接口以匹配新数据结构：

```typescript
interface SchoolCase {
  name: string;
  region: Region;
  grade: Grade[];
  abbr: string;
  partnership: string;
  results: string;
  color: string;
  coverImage?: string | null;
  schoolLogo?: string | null;
}
```

- [ ] **Step 3: 修改案例卡片渲染逻辑**

找到案例卡片的渲染部分（约第297-303行），修改以支持图片：

```typescript
{/* logo placeholder */}
<div className={`h-32 bg-gradient-to-br ${c.color} flex items-center justify-center relative overflow-hidden`}>
  {c.coverImage ? (
    <img
      src={c.coverImage}
      alt={c.name}
      className="absolute inset-0 w-full h-full object-cover"
    />
  ) : (
    <>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-40" />
    </>
  )}
  {c.schoolLogo ? (
    <img
      src={c.schoolLogo}
      alt={`${c.name} logo`}
      className="w-16 h-16 rounded-xl object-cover border-2 border-white/30"
    />
  ) : (
    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-2xl font-bold border border-white/30">
      {c.abbr.slice(0, 2)}
    </div>
  )}
</div>
```

- [ ] **Step 4: 测试前台页面**

访问 http://localhost:3000/cages 确认页面显示正常。

- [ ] **Step 5: 提交**

```bash
git add src/app/cases/page.tsx
git commit -m "feat: fetch cases data from API instead of hardcoded"
```

---

## Task 9: 扩展后台管理界面 - 学校案例

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 更新 CasesEditor 组件的 schools 数据处理**

在 `src/app/admin/page.tsx` 中，找到 `CasesEditor` 函数（约第380行），修改数据获取逻辑：

```typescript
function CasesEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  // 从 API 获取的数据格式: { schoolCases: [...], competitionHonors: [...] }
  const schools = (data.schoolCases as Record<string, unknown>[]) ?? [];
  const competitions = (data.competitionHonors as Record<string, unknown>[]) ?? [];
```

- [ ] **Step 2: 修改学校案例渲染表单**

在 `CasesEditor` 中，找到 `renderItem` 的学校案例部分（约第392行），替换为：

```typescript
renderItem={(item, _i, update) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FieldEditor label="学校名称" value={(item.name as string) || ""} onChange={(v) => update("name", v)} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
          value={(item.region as string) || ""}
          onChange={(e) => update("region", e.target.value)}
        >
          <option value="">请选择</option>
          <option value="北京">北京</option>
          <option value="上海">上海</option>
          <option value="浙江">浙江</option>
          <option value="其他">其他</option>
        </select>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">学段</label>
      <div className="flex gap-2 flex-wrap">
        {["小学", "初中", "高中"].map((g) => (
          <label key={g} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={((item.grade as string[]) || []).includes(g)}
              onChange={(e) => {
                const currentGrades = (item.grade as string[]) || [];
                const newGrades = e.target.checked
                  ? [...currentGrades, g]
                  : currentGrades.filter((x) => x !== g);
                update("grade", newGrades);
              }}
              className="rounded border-gray-300"
            />
            {g}
          </label>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FieldEditor label="缩写" value={(item.abbr as string) || ""} onChange={(v) => update("abbr", v)} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
          value={(item.color as string) || ""}
          onChange={(e) => update("color", e.target.value)}
        >
          <option value="from-[#1A3C8A] to-[#2B6CB0]">蓝色渐变</option>
          <option value="from-[#2B6CB0] to-blue-500">浅蓝渐变</option>
          <option value="from-[#D4A843] to-amber-500">金色渐变</option>
          <option value="from-purple-600 to-indigo-600">紫色渐变</option>
          <option value="from-teal-600 to-cyan-600">青色渐变</option>
          <option value="from-rose-500 to-pink-600">粉色渐变</option>
        </select>
      </div>
    </div>
    <FieldEditor label="合作内容" value={(item.partnership as string) || ""} onChange={(v) => update("partnership", v)} multiline />
    <FieldEditor label="成果" value={(item.results as string) || ""} onChange={(v) => update("results", v)} multiline />
    <ImageButton
      label="封面图 (可选)"
      value={(item.coverImage as string) || ""}
      onChange={(v) => update("coverImage", v)}
      type="cases/cover"
    />
    <ImageButton
      label="学校 Logo (可选)"
      value={(item.schoolLogo as string) || ""}
      onChange={(v) => update("schoolLogo", v)}
      type="cases/logo"
    />
  </>
)}
```

- [ ] **Step 3: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: extend school case editor with new fields and image upload"
```

---

## Task 10: 扩展后台管理界面 - 赛事荣誉

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: 修改赛事荣誉渲染表单**

在 `CasesEditor` 中，找到赛事荣誉的 `renderItem` 部分（约第412行），替换为：

```typescript
renderItem={(item, _i, update) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FieldEditor label="赛事名称" value={(item.title as string) || ""} onChange={(v) => update("title", v)} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">级别</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
          value={(item.level as string) || ""}
          onChange={(e) => update("level", e.target.value)}
        >
          <option value="国际">国际</option>
          <option value="全国">全国</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FieldEditor label="年份" value={(item.year as string) || ""} onChange={(v) => update("year", v)} />
      <FieldEditor label="获奖成果" value={(item.achievements as string) || ""} onChange={(v) => update("achievements", v)} />
    </div>
    <ImageButton
      label="奖杯图片 (可选)"
      value={(item.image as string) || ""}
      onChange={(v) => update("image", v)}
      type="cases/trophy"
    />
  </>
)}
```

- [ ] **Step 2: 测试后台管理界面**

访问 http://localhost:3000/admin → "案例管理"，测试编辑和保存功能。

- [ ] **Step 3: 提交**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: extend competition honor editor with achievements and image upload"
```

---

## Task 11: 添加赛事荣誉前台卡片展示

**Files:**
- Modify: `src/app/cases/page.tsx`

- [ ] **Step 1: 更新 Competition 接口**

找到 `Competition` 接口定义（约第100行），更新为：

```typescript
interface Competition {
  title: string;
  level: string;
  achievements: string;
  year: string;
  image?: string | null;
}
```

- [ ] **Step 2: 修改赛事荣誉卡片渲染**

找到赛事荣誉列表渲染部分（约第371-387行），替换为卡片样式：

```typescript
{/* competition list */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
  {competitions.map((comp) => (
    <div key={comp.title} className={`group bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      comp.level === "国际"
        ? "border-amber-200 hover:border-amber-400"
        : "border-blue-200 hover:border-blue-400"
    }`}>
      {/* 图标/图片区域 */}
      <div className={`h-24 flex items-center justify-center ${
        comp.level === "国际" ? "bg-gradient-to-br from-amber-50 to-amber-100" : "bg-gradient-to-br from-blue-50 to-blue-100"
      }`}>
        {comp.image ? (
          <img src={comp.image} alt={comp.title} className="w-16 h-16 object-contain" />
        ) : (
          <span className="text-4xl">🏆</span>
        )}
      </div>
      <div className="p-5">
        <h4 className="font-bold text-[#333333] mb-2 line-clamp-2">{comp.title}</h4>
        <p className={`text-sm font-medium mb-1 ${
          comp.level === "国际" ? "text-amber-600" : "text-[#2B6CB0]"
        }`}>{comp.achievements}</p>
        <p className="text-xs text-[#666666]">{comp.year}</p>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 3: 测试前台页面**

访问 http://localhost:3000/cases，切换到"赛事荣誉" tab 查看效果。

- [ ] **Step 4: 提交**

```bash
git add src/app/cases/page.tsx
git commit -m "feat: display competition honors as cards with trophy images"
```

---

## Task 12: 端到端测试和验证

**Files:**
- None (testing)

- [ ] **Step 1: 验证数据迁移成功**

```bash
npx tsx scripts/seed-cases.ts
```

- [ ] **Step 2: 测试前台展示**

访问 http://localhost:3000/cases，验证：
- 案例卡片显示正常
- 无图片时显示默认样式
- 赛事荣誉卡片显示正常
- 筛选功能正常工作

- [ ] **Step 3: 测试后台管理**

访问 http://localhost:3000/admin，验证：
- 可以查看案例列表
- 可以编辑现有案例
- 可以新增案例
- 可以上传封面图和 logo
- 可以查看赛事荣誉列表
- 可以编辑和新增赛事荣誉
- 保存后前台数据更新

- [ ] **Step 4: 测试图片回退逻辑**

在后台创建一个没有封面图和 logo 的案例，确认前台显示默认样式。

- [ ] **Step 5: 最终提交**

```bash
git add .
git commit -m "chore: complete cases and competitions backend management implementation"
```

---

## 验收标准检查清单

- [ ] 后台可以添加、编辑、删除学校案例
- [ ] 后台可以添加、编辑、删除赛事荣誉
- [ ] 支持拖拽排序
- [ ] 封面图和 logo 可选上传，无图时显示默认样式
- [ ] 前台正确显示从数据库获取的数据
- [ ] 初始数据通过迁移脚本正确导入
