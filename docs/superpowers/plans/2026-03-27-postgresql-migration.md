# PostgreSQL 数据库迁移实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 将企业官网从 JSON 文件存储迁移到 PostgreSQL 数据库，使用 Prisma ORM，支持 Docker 部署。

**架构:** 保持 Next.js 全栈架构，使用 Prisma Client 在 Server Components 和 API Routes 中访问数据库，通过 Docker 容器化部署。

**技术栈:** Next.js 16 + React 19 + TypeScript + Prisma + PostgreSQL + Docker

---

## 文件结构概览

```
hcy_website/
├── prisma/
│   ├── schema.prisma           # Prisma 数据模型定义
│   └── migrations/             # 自动生成的迁移文件
├── src/lib/
│   ├── data.ts                 # 修改：使用 Prisma 替代 fs
│   └── prisma.ts               # 新增：Prisma Client 单例
├── src/app/api/admin/
│   ├── auth/route.ts           # 修改：集成数据库认证
│   └── [collection]/route.ts   # 修改：使用 Prisma CRUD
├── scripts/
│   └── migrate-data.ts         # 新增：JSON → PostgreSQL 迁移脚本
├── Dockerfile                  # 新增：Docker 镜像构建
├── docker-compose.yml          # 新增：本地开发编排
├── next.config.ts              # 修改：开启 standalone 输出
└── .env.development            # 已存在：环境配置
```

---

## Task 1: 安装 Prisma 依赖

**文件:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: 安装 Prisma CLI**

```bash
npm install prisma --save-dev
```

预期输出: `added 1 package, ...`

- [ ] **Step 1.1: 安装 Prisma Client (运行时依赖)**

```bash
npm install @prisma/client
```

预期输出: `added 1 package, ...`

- [ ] **Step 2: 初始化 Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

预期输出: 创建 `prisma/schema.prisma` 和 `.env` 文件

- [ ] **Step 3: 更新 .env.development 中的数据库连接**

```
DATABASE_URL="postgresql://postgres:truth@localhost:5432/hcy_website"
```

- [ ] **Step 4: 提交**

```bash
git add package.json package-lock.json prisma/
git commit -m "feat: install and initialize Prisma"
```

---

## Task 2: 创建 Prisma Schema

**文件:**
- Modify: `prisma/schema.prisma`

基于现有 JSON 数据结构设计数据模型：

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── 用户管理 ───
model AdminUser {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  name      String?
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── 首页内容 ───
model HomeContent {
  id         String   @id @default(cuid())
  heroSlides Json
  dataStrip  Json
  highlights Json
  partners   Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ─── 新闻文章 ───
model NewsArticle {
  id        String   @id @default(cuid())
  title     String
  excerpt   String
  content   String   @db.Text
  category  String
  date      DateTime
  image     String?
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([date, published])
}

// ─── 关于我们 ───
model AboutContent {
  id        String   @id @default(cuid())
  intro     Json
  culture   Json
  timeline  Json
  honors    Json
  partners  Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── 案例与成果 ───
model SchoolCase {
  id        String   @id @default(cuid())
  name      String
  type      String
  region    String
  stage     String
  summary   String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CompetitionHonor {
  id        String   @id @default(cuid())
  title     String
  level     String
  year      String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── 联系方式 ───
model ContactInfo {
  id        String   @id @default(cuid())
  address   String
  contacts  Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── 招聘岗位 ───
model JobPosition {
  id          String   @id @default(cuid())
  title       String
  department  String
  location    String
  type        String
  description String   @db.Text
  requirements Json
  active      Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([active, order])
}

// ─── 站点配置 ───
model SiteConfig {
  id            String @id @default(cuid())
  companyName   String
  shortName     String
  address       String
  icp           String
  copyright     String
  friendlyLinks Json
  socialLinks   Json
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ─── 留言表单提交 ───
model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  company   String?
  phone     String
  email     String?
  needType  String
  message   String   @db.Text
  handled   Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- [ ] **Step 1: 编写 schema.prisma 文件**

使用上面的完整内容替换 `prisma/schema.prisma`

- [ ] **Step 2: 生成并运行迁移**

```bash
npx prisma migrate dev --name init
```

预期输出: 创建数据库表，生成迁移文件

- [ ] **Step 3: 生成 Prisma Client**

```bash
npx prisma generate
```

预期输出: `Generated Prisma Client ...`

- [ ] **Step 4: 提交**

```bash
git add prisma/
git commit -m "feat: create Prisma schema and initial migration"
```

---

## Task 3: 创建 Prisma Client 单例

**文件:**
- Create: `src/lib/prisma.ts`

- [ ] **Step 1: 创建 Prisma Client 实例**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/prisma.ts
git commit -m "feat: add Prisma client singleton"
```

---

## Task 4: 编写数据迁移脚本

**文件:**
- Create: `scripts/migrate-data.ts`

- [ ] **Step 1: 创建迁移脚本目录**

```bash
mkdir -p scripts
```

- [ ] **Step 2: 编写迁移脚本**

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function migrate() {
  console.log('开始迁移数据...')

  // 读取 JSON 文件
  const dataDir = path.join(process.cwd(), 'data')
  const home = JSON.parse(await readFile(path.join(dataDir, 'home.json'), 'utf-8'))
  const news = JSON.parse(await readFile(path.join(dataDir, 'news.json'), 'utf-8'))
  const about = JSON.parse(await readFile(path.join(dataDir, 'about.json'), 'utf-8'))
  const cases = JSON.parse(await readFile(path.join(dataDir, 'cases.json'), 'utf-8'))
  const contact = JSON.parse(await readFile(path.join(dataDir, 'contact.json'), 'utf-8'))
  const join = JSON.parse(await readFile(path.join(dataDir, 'join.json'), 'utf-8'))
  const site = JSON.parse(await readFile(path.join(dataDir, 'site.json'), 'utf-8'))

  // 清空现有数据
  await prisma.homeContent.deleteMany()
  await prisma.newsArticle.deleteMany()
  await prisma.aboutContent.deleteMany()
  await prisma.schoolCase.deleteMany()
  await prisma.competitionHonor.deleteMany()
  await prisma.contactInfo.deleteMany()
  await prisma.jobPosition.deleteMany()
  await prisma.siteConfig.deleteMany()

  // 迁移首页内容
  await prisma.homeContent.create({
    data: {
      heroSlides: home.heroSlides,
      dataStrip: home.dataStrip,
      highlights: home.highlights,
      partners: home.partners,
    },
  })
  console.log('✓ 首页内容')

  // 迁移新闻
  for (const article of news.articles) {
    await prisma.newsArticle.create({
      data: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        date: new Date(article.date),
        image: article.image,
      },
    })
  }
  console.log(`✓ 新闻文章 (${news.articles.length}条)`)

  // 迁移关于我们
  await prisma.aboutContent.create({
    data: {
      intro: about.intro,
      culture: about.culture,
      timeline: about.timeline,
      honors: about.honors,
      partners: about.partners,
    },
  })
  console.log('✓ 关于我们')

  // 迁移案例
  for (const item of cases.schoolCases) {
    await prisma.schoolCase.create({
      data: {
        name: item.name,
        type: item.type,
        region: item.region,
        stage: item.stage,
        summary: item.summary,
      },
    })
  }
  console.log(`✓ 学校案例 (${cases.schoolCases.length}条)`)

  for (const item of cases.competitionHonors) {
    await prisma.competitionHonor.create({
      data: {
        title: item.title,
        level: item.level,
        year: item.year,
      },
    })
  }
  console.log(`✓ 竞赛荣誉 (${cases.competitionHonors.length}条)`)

  // 迁移联系方式
  await prisma.contactInfo.create({
    data: {
      address: contact.address,
      contacts: contact.contacts,
    },
  })
  console.log('✓ 联系方式')

  // 迁移招聘
  for (const item of join.jobPositions) {
    await prisma.jobPosition.create({
      data: {
        title: item.title,
        department: item.department,
        location: item.location,
        type: item.type,
        description: item.description,
        requirements: item.requirements,
      },
    })
  }
  console.log(`✓ 招聘岗位 (${join.jobPositions.length}条)`)

  // 迁移站点配置
  await prisma.siteConfig.create({
    data: {
      companyName: site.companyName,
      shortName: site.shortName,
      address: site.address,
      icp: site.icp,
      copyright: site.copyright,
      friendlyLinks: site.friendlyLinks,
      socialLinks: site.socialLinks,
    },
  })
  console.log('✓ 站点配置')

  // 创建默认管理员
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash('haichuangyuan2026', 10)
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '管理员',
      role: 'ADMIN',
    },
  })
  console.log('✓ 默认管理员 (用户名: admin, 密码: haichuangyuan2026)')

  console.log('\n数据迁移完成!')
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 3: 安装 bcryptjs 和 tsx 依赖**

```bash
npm install bcryptjs @types/bcryptjs tsx --save-dev
```

- [ ] **Step 4: 运行迁移脚本**

```bash
npx tsx scripts/migrate-data.ts
```

预期输出: 显示各表迁移成功的日志

- [ ] **Step 5: 验证数据**

```bash
npx prisma studio
```

在浏览器中访问 http://localhost:5555 验证数据

- [ ] **Step 6: 提交**

```bash
git add scripts/ package.json package-lock.json
git commit -m "feat: add data migration script from JSON to PostgreSQL"
```

---

## Task 5: 修改数据访问层

**文件:**
- Modify: `src/lib/data.ts`

- [ ] **Step 1: 替换 data.ts 内容**

```typescript
// src/lib/data.ts
import "server-only";
import { prisma } from "./prisma";

// 首页内容
export async function loadHome() {
  const data = await prisma.homeContent.findFirst()
  if (!data) throw new Error("Home content not found")
  return {
    heroSlides: data.heroSlides as any[],
    dataStrip: data.dataStrip as any[],
    highlights: data.highlights as any[],
    partners: data.partners as string[],
  }
}

// 新闻
export async function loadNews() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: { date: 'desc' }
  })
  return { articles }
}

// 关于我们
export async function loadAbout() {
  const data = await prisma.aboutContent.findFirst()
  if (!data) throw new Error("About content not found")
  return data
}

// 案例
export async function loadCases() {
  const [schools, competitions] = await Promise.all([
    prisma.schoolCase.findMany({ orderBy: { order: 'asc' } }),
    prisma.competitionHonor.findMany({ orderBy: { order: 'asc' } }),
  ])
  return { schoolCases: schools, competitionHonors: competitions }
}

// 联系方式
export async function loadContact() {
  const data = await prisma.contactInfo.findFirst()
  if (!data) throw new Error("Contact info not found")
  return {
    address: data.address,
    contacts: data.contacts as any[],
  }
}

// 招聘
export async function loadJoin() {
  const positions = await prisma.jobPosition.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })
  return { jobPositions: positions }
}

// 站点配置
export async function loadSite() {
  const data = await prisma.siteConfig.findFirst()
  if (!data) throw new Error("Site config not found")
  return data
}

// 保存内容（后台管理用）
export async function saveContent(collection: string, data: any) {
  switch (collection) {
    case 'home': {
      const existing = await prisma.homeContent.findFirst()
      if (!existing) throw new Error("No home content found")
      return await prisma.homeContent.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'about': {
      const existing = await prisma.aboutContent.findFirst()
      if (!existing) throw new Error("No about content found")
      return await prisma.aboutContent.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'contact': {
      const existing = await prisma.contactInfo.findFirst()
      if (!existing) throw new Error("No contact info found")
      return await prisma.contactInfo.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'site': {
      const existing = await prisma.siteConfig.findFirst()
      if (!existing) throw new Error("No site config found")
      return await prisma.siteConfig.update({
        where: { id: existing.id },
        data,
      })
    }
    case 'join':
    case 'cases':
      // 这些集合使用子表，需要特殊处理
      throw new Error(`Use specific CRUD operations for ${collection}`)
    default:
      throw new Error(`Unknown collection: ${collection}`)
  }
}

// 兼容旧接口
export async function loadData<T = any>(filename: string): Promise<T> {
  const mapper: Record<string, () => Promise<any>> = {
    'home': loadHome,
    'news': loadNews,
    'about': loadAbout,
    'cases': loadCases,
    'contact': loadContact,
    'join': loadJoin,
    'site': loadSite,
  }
  const loader = mapper[filename]
  if (!loader) throw new Error(`Unknown data file: ${filename}`)
  return loader() as T
}

export async function saveData<T = any>(filename: string, data: T): Promise<void> {
  // 实现保存逻辑
  await saveContent(filename, data)
}
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/data.ts
git commit -m "refactor: replace JSON file I/O with Prisma database access"
```

---

## Task 6: 修改后台 API

**文件:**
- Modify: `src/app/api/admin/auth/route.ts`
- Modify: `src/app/api/admin/[collection]/route.ts`

- [ ] **Step 1: 修改认证路由使用数据库**

```typescript
// src/app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { password, username } = await request.json();

    const user = await prisma.adminUser.findUnique({
      where: { username: username || 'admin' }
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      token: Buffer.from(`${user.id}:${Date.now()}`).toString("base64"),
      user: { name: user.name, role: user.role }
    });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
```

- [ ] **Step 2: 修改内容管理路由使用数据库**

```typescript
// src/app/api/admin/[collection]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_COLLECTIONS = ["home", "news", "about", "cases", "contact", "site", "join"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  try {
    let data;
    switch (collection) {
      case "home":
        data = await prisma.homeContent.findFirst();
        break;
      case "news":
        data = { articles: await prisma.newsArticle.findMany({ orderBy: { date: 'desc' } }) };
        break;
      case "about":
        data = await prisma.aboutContent.findFirst();
        break;
      case "cases":
        const [schools, competitions] = await Promise.all([
          prisma.schoolCase.findMany({ orderBy: { order: 'asc' } }),
          prisma.competitionHonor.findMany({ orderBy: { order: 'asc' } }),
        ]);
        data = { schoolCases: schools, competitionHonors: competitions };
        break;
      case "contact":
        data = await prisma.contactInfo.findFirst();
        break;
      case "join":
        data = { jobPositions: await prisma.jobPosition.findMany({ where: { active: true }, orderBy: { order: 'asc' } }) };
        break;
      case "site":
        data = await prisma.siteConfig.findFirst();
        break;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  try {
    const body = await request.json();

    // 单例类型的内容更新
    if (["home", "about", "contact", "site"].includes(collection)) {
      const existing = await getSingleRecord(collection);
      if (!existing) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }
      const model = getModel(collection);
      await prisma[model].update({
        where: { id: existing.id },
        data: body,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

// 辅助函数
async function getSingleRecord(collection: string) {
  switch (collection) {
    case "home": return await prisma.homeContent.findFirst();
    case "about": return await prisma.aboutContent.findFirst();
    case "contact": return await prisma.contactInfo.findFirst();
    case "site": return await prisma.siteConfig.findFirst();
    default: return null;
  }
}

function getModel(collection: string): string {
  const map: Record<string, string> = {
    home: "homeContent",
    about: "aboutContent",
    contact: "contactInfo",
    site: "siteConfig",
  };
  return map[collection] || collection;
}
```

- [ ] **Step 3: 提交**

```bash
git add src/app/api/admin/auth/route.ts src/app/api/admin/[collection]/route.ts
git commit -m "feat: use database for admin authentication and content management"
```

---

## Task 7: 创建 Docker 配置

**文件:**
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `docker-compose.yml` (可选，本地开发用)

- [ ] **Step 1: 修改 next.config.ts 开启 standalone 模式**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Docker 部署必须
};

export default nextConfig;
```

- [ ] **Step 2: 创建 .dockerignore**

```
# Dependencies
node_modules
npm-debug.log
yarn-error.log

# Next.js
.next
out

# Environment
.env
.env.*
!.env.example

# Git
.git
.gitignore

# IDE
.vscode
.idea

# Docs
docs

# Data (已迁移到数据库)
data
```

- [ ] **Step 3: 创建 Dockerfile**

```dockerfile
# 多阶段构建 - 依赖安装
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# 多阶段构建 - 构建
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建应用
RUN npm run build

# 多阶段构建 - 运行
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 Prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# 复制迁移脚本和数据文件（用于首次部署）
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data ./data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

- [ ] **Step 4: 创建 docker-compose.yml (本地开发)**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=truth
      - POSTGRES_DB=hcy_website
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

- [ ] **Step 5: 提交**

```bash
git add next.config.ts Dockerfile .dockerignore docker-compose.yml
git commit -m "feat: add Docker configuration for deployment"
```

---

## Task 7.5: 添加健康检查端点

**文件:**
- Create: `src/app/api/health/route.ts`

- [ ] **Step 1: 创建健康检查端点**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: "ok", database: "connected" })
  } catch (error) {
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 503 }
    )
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/health/route.ts
git commit -m "feat: add health check endpoint"
```

---

## Task 8: 本地测试验证

- [ ] **Step 1: 构建并运行 Docker**

```bash
docker-compose up --build
```

预期输出: 服务启动在 http://localhost:3000

- [ ] **Step 2: 验证页面访问**

访问 http://localhost:3000，检查:
- 首页正常显示
- 所有页面路由可访问
- 数据正确显示

- [ ] **Step 3: 验证后台管理**

访问 http://localhost:3000/admin，检查:
- 登录功能正常 (admin / haichuangyuan2026)
- 内容编辑功能正常
- 保存后数据库更新

- [ ] **Step 4: 停止服务**

```bash
docker-compose down
```

---

## Task 9: 生产部署准备

- [ ] **Step 1: 构建生产镜像**

```bash
docker build -t hcy-website:latest .
```

- [ ] **Step 2: 测试运行**

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="生产数据库连接" \
  -e ADMIN_PASSWORD="生产密码" \
  --name hcy-website \
  hcy-website:latest
```

- [ ] **Step 3: 准备部署文档**

创建 `docs/deployment.md`:

```markdown
# 生产部署指南

## 环境变量

- `DATABASE_URL`: PostgreSQL 连接字符串
- `ADMIN_PASSWORD`: 管理后台密码

## 部署步骤

1. 加载镜像:
   ```bash
   docker load < hcy-website.tar
   ```

2. 运行容器:
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URL="..." \
     -e ADMIN_PASSWORD="..." \
     --name hcy-website \
     --restart=unless-stopped \
     hcy-website:latest
   ```

3. 配置 nginx 反向代理 (可选)

## 数据库迁移

首次部署需运行迁移:
```bash
docker exec hcy-website npx prisma migrate deploy
docker exec hcy-website npx tsx /app/scripts/migrate-data.ts
```
```

- [ ] **Step 4: 提交**

```bash
git add docs/deployment.md
git commit -m "docs: add production deployment guide"
```

---

## Task 10: 清理和文档

- [ ] **Step 1: 更新 README.md**

添加项目架构说明、环境要求、本地开发步骤

- [ ] **Step 2: 更新 .gitignore**

确保 `data/` 目录添加到忽略 (已迁移到数据库)

- [ ] **Step 3: 最终提交**

```bash
git add README.md .gitignore
git commit -m "docs: update README and gitignore for database migration"
```

---

## 验收标准

- [ ] 所有页面从数据库读取数据正常
- [ ] 后台管理可以编辑并保存内容到数据库
- [ ] Docker 镜像可以正常构建和运行
- [ ] 生产环境可以部署和访问
- [ ] 数据迁移脚本运行无误
