# MVP 极速全栈开发进阶指南

> 🚀 **The "Solopreneur" Stack** (独立开发者技术栈)
> 本指南旨在为熟悉 AWS/Python/iOS 的开发者提供一条通往**现代 Web 全栈开发**的高速公路。

---

## 1. 核心理念：快、省、稳

在 MVP (Minimum Viable Product) 阶段，我们的目标是：
- **0 配置服务器** (No Ops)
- **0 成本启动** (Free Tier)
- **类型安全** (Type Safety) - 最大的生产力提升来源

## 2. 黄金技术组合 (The Stack)

本项目采用的正是目前业界最推崇的 **"T3 Stack" 变体**：

| 组件 | 选型 | 你的旧知识映射 | 核心优势 |
|------|------|----------------|----------|
| **框架** | **Next.js (App Dir)** | Django / Flask + React | 前后端不分离，API 和页面写在一起，共享类型。 |
| **语言** | **TypeScript** | Python (带 Type Hints) | **智能提示**。后端改了字段，前端立马红线报错。 |
| **数据库** | **Supabase (PostgreSQL)** | AWS RDS / Aurora | 像 Firebase 一样好用的 Postgres。自带管理后台。 |
| **ORM** | **Prisma** | Django ORM / SQLAlchemy | **灵魂组件**。自动生成类型定义，数据库操作极其优雅。 |
| **UI** | **Tailwind CSS** | CSS / Bootstrap | 不写 CSS 文件，直接写 class。 |
| **部署** | **Vercel** | AWS Amplify / Lambda | `git push` 即上线。自动配置 CI/CD、HTTPS、CDN。 |

---

## 3. 标准开发工作流 (SOP)

### 第 1 步：脚手架初始化 (10 min)
```bash
# 一键生成项目骨架
npx create-next-app@latest my-app --typescript --tailwind --eslint

# 安装灵魂组件
npm install prisma --save-dev
npx prisma init
```

### 第 2 步：数据建模 (20 min) ⭐最关键
不要先写代码，先画数据库图。修改 `prisma/schema.prisma`：

```prisma
// 定义用户模型
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  orders    Order[]  // 关联关系
}

model Order {
  id        String   @id @default(cuid())
  amount    Int
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```
运行同步命令，Supabase 表结构自动创建：
```bash
npx prisma db push
```

### 第 3 步：后端逻辑 (Server Actions) (30 min)
Next.js 14+ 允许直接在组件里写后端逻辑，无需传统的 API 路由：

```typescript
// app/actions.ts
'use server' // 标记为服务端代码
import prisma from '@/lib/prisma'

export async function createOrder(userId: string, amount: number) {
  // 直接操作数据库
  return await prisma.order.create({
    data: { userId, amount }
  })
}
```

### 第 4 步：前端调用 (UI) (30 min)
```tsx
// app/page.tsx
'use client'
import { createOrder } from './actions' // 像导入函数一样导入后端逻辑！

export default function Page() {
  return (
    <button onClick={() => createOrder('user_123', 100)}>
      下单
    </button>
  )
}
```

### 第 5 步：极速上线 (2 min)
1. 代码推送到 GitHub。
2. Vercel 后台点击 "Import Project"。
3. 填入 `DATABASE_URL`。
4. **上线！**

---

## 4. 进阶学习路线图

1.  **TypeScript 深度**
    *   学习 `interface`, `type`, `Generics` (泛型)。
    *   目标：消灭所有 `any`。

2.  **Next.js 核心**
    *   **Server Components (RSC)**: 默认组件在服务端渲染，不发送 JS 到浏览器。
    *   **Server Actions**: 表单提交和数据变更的新范式。

3.  **Prisma 高级**
    *   关联查询 (`include`), 聚合 (`aggregate`), 事务 (`transaction`)。

4.  **UI 进阶**
    *   **shadcn/ui**: 目前最火的组件库，直接复制源码到你项目，拥有完全控制权。

---

## 5. 常见误区预警 ⚠️

- **不要手写 SQL**：除非为了极致性能，否则 Prisma 足够从 MVP 用到 B 轮融资。
- **不要过早分离前后端**：独立后端（Go/Java）会增加 API 对接成本，MVP 阶段 Next.js 全栈最快。
- **不要忽视 Vercel Logs**：线上报错去 Vercel Dashboard 看 Logs 是第一反应。
- **Supabase 连接池**：Serverless 环境一定要用 Connection Pooler (端口 6543)，血的教训。

---

> **总结**：这套技术栈的核心是 **"类型穿透" (End-to-End Type Safety)**。
> 从数据库 (Prisma) -> 后端 (Next.js) -> 前端 (React)，类型定义是自动传递的。
> **后端改一个字段名，前端引用的地方立马报错**。这种开发体验能让你开发速度提升 10 倍，Bug 减少 90%。
