# Anti Community Membership System (社群会员管理系统)

这是一个基于现代 Web 技术栈构建的社群会员管理系统 MVP。它允许用户注册会员、展示动态会员码、查看积分，并允许商家扫码验证会员身份及模拟消费。

## 🌟 核心功能

*   **用户认证**：基于 JWT 和 Context 的轻量级认证系统（支持管理员和普通用户）。
*   **电子会员卡**：精美的 UI 展示，包含等级、积分和入会时间。
*   **动态二维码**：每 60 秒自动刷新的安全二维码，防止截图盗用。
*   **商家扫码端**：独立的商家页面，支持扫码验证用户身份并增加积分。
*   **管理后台**：管理员可查看所有会员列表及创建新会员。

## 🛠️ 技术栈 (The T3 Stack 变体)

本项目采用目前业界流行的全栈开发组合，追求极致的开发效率和类型安全。

*   **全栈框架**: [Next.js 15+ (App Router)](https://nextjs.org/) - React 的服务端渲染框架。
*   **开发语言**: [TypeScript](https://www.typescriptlang.org/) - 提供端到端的类型安全。
*   **数据库**: [PostgreSQL (via Supabase)](https://supabase.com/) - 强大的开源关系型数据库。
*   **ORM**: [Prisma](https://www.prisma.io/) - 下一代 Node.js 和 TypeScript ORM。
*   **样式库**: [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架。
*   **UI 组件**: [Lucide React](https://lucide.dev/) - 精美的图标库。
*   **部署平台**: [Vercel](https://vercel.com/) - 零配置的 Serverless 部署。

## 🚀 快速开始

### 1. 环境准备

确保你安装了 Node.js 18+。

```bash
git clone <repository-url>
cd web-coding
npm install
```

### 2. 配置环境变量

复制 `.env.example` (如果不存在则参考以下内容) 到 `.env`：

```env
# Supabase Transaction Pooler 连接字符串 (本地开发推荐用 6543 端口)
# 注意：Vercel 部署时必须添加 ?pgbouncer=true 参数
DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# JWT 密钥 (本地开发可随意设置)
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. 初始化数据库

使用 Prisma 同步数据库结构：

```bash
npx prisma db push
# 或者生成 Client
npx prisma generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 📂 项目结构

```
src/
├── app/               # Next.js App Router 页面
│   ├── api/           # 后端 API 路由 (Login, Users, Merchants)
│   ├── login/         # 登录页
│   ├── admin/         # 管理员后台
│   ├── store/         # 商家端页面
│   └── page.tsx       # 用户首页 (会员卡)
├── context/           # React Context (AuthContext)
└── lib/               # 工具函数 (Prisma Client 单例)
prisma/
└── schema.prisma      # 数据库模型定义
```

## 🌐 部署

本项目针对 **Vercel** 进行了优化。

1.  将代码推送到 GitHub。
2.  在 Vercel 中导入项目。
3.  配置 `DATABASE_URL` 环境变量（使用 Supabase Transaction Pooler 端口 6543）。
4.  点击 Deploy。

**注意**：由于 Vercel 是 Serverless 环境，连接数据库必须使用 **Connection Pooling** (Supabase 端口 6543)，并在 URL 末尾添加 `?pgbouncer=true` 以禁用 Prepared Statements。

## 🧪 测试账号

系统已预置以下测试账号（如果有运行 seed 脚本）：

*   **管理员**: `admin` / `admin`
*   **普通用户**: `testuser` / `123`
*   **新创建用户**: 自动生成的用户名 (如 `user103`) / `123`

## 📄 文档资源

更多详细文档请参考 `doc/` 目录：
*   `ARCHITECTURE_GUIDE.md`: 技术架构详解
*   `DEPLOY_GUIDE.md`: 部署操作流程
*   `VERCEL_SUPABASE_GUIDE.md`: Vercel & Supabase 原理对照
*   `MVP_STACK_GUIDE.md`: MVP 全栈开发进阶指南
