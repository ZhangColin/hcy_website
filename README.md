# 海创元AI教育官网

> Next.js 16 + React 19 + TypeScript + Prisma + PostgreSQL

企业级官网解决方案，采用现代化技术栈构建，支持内容动态管理。

## 项目架构

```
hcy_website/
├── prisma/              # Prisma ORM 配置和迁移文件
│   └── schema.prisma    # 数据库模型定义
├── scripts/             # 工具脚本
│   └── migrate-data.ts  # JSON 数据迁移到数据库脚本
├── src/
│   ├── app/            # Next.js App Router 页面
│   │   ├── (main)/     # 前台页面
│   │   └── admin/      # 后台管理
│   ├── components/     # React 组件
│   └── lib/           # 工具库和数据库客户端
├── public/            # 静态资源
└── data/              # 原始 JSON 数据（已迁移到数据库，可删除）
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16.2.1 (App Router) |
| UI | React 19.2.4 + Tailwind CSS 4 |
| 语言 | TypeScript 5 |
| ORM | Prisma 7.6.0 |
| 数据库 | PostgreSQL |
| 认证 | bcryptjs |

## 环境要求

- Node.js 18+
- PostgreSQL 14+
- npm 或 pnpm

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.development` 并填写数据库连接信息：

```bash
cp .env.example .env.development
```

编辑 `.env.development`：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hcy_website"
ADMIN_PASSWORD="your-secure-password"
NODE_ENV="development"
```

### 3. 启动数据库

使用 Docker Compose 启动 PostgreSQL：

```bash
docker-compose up -d
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# （可选）从 JSON 文件迁移初始数据
npm run migrate:data
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看前台。

### 6. 访问管理后台

访问 [http://localhost:3000/admin](http://localhost:3000/admin) 使用管理员密码登录。

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run prisma:generate` | 生成 Prisma Client |
| `npm run prisma:migrate` | 运行数据库迁移 |
| `npm run prisma:push` | 推送 schema 到数据库（开发用） |
| `npm run prisma:studio` | 启动 Prisma Studio 数据管理界面 |
| `npm run migrate:data` | 从 JSON 文件迁移数据到数据库 |

## 数据库模型

项目使用 Prisma 管理 PostgreSQL 数据库，主要模型包括：

- **AdminUser** - 管理员用户
- **HomeContent** - 首页内容（轮播图、数据条、亮点、合作伙伴）
- **NewsArticle** - 新闻文章
- **AboutContent** - 关于我们
- **SchoolCase** - 学校案例
- **CompetitionHonor** - 竞赛荣誉
- **ContactInfo** - 联系方式
- **JobPosition** - 招聘岗位
- **SiteConfig** - 站点配置
- **ContactSubmission** - 留言表单提交

详细模型定义见 `prisma/schema.prisma`。

## 部署

### 使用 Docker

```bash
docker build -t hcy-website .
docker run -p 3000:3000 --env-file .env.production hcy-website
```

### 使用 Vercel

项目支持部署到 Vercel，需配置环境变量 `DATABASE_URL`。

## 注意事项

1. `data/` 目录包含原始 JSON 数据，已迁移到数据库，可安全删除
2. 生产环境请修改 `ADMIN_PASSWORD` 为强密码
3. 数据库迁移文件应纳入版本控制
