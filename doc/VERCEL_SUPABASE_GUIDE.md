# Vercel & Supabase 详解

> 📌 **写给 AWS Lambda/API Gateway 开发者**

---

## 🔄 概念对照表

| AWS 概念 | 对应技术 | 说明 |
|----------|----------|------|
| API Gateway | Vercel (自动) | 路由、HTTPS、域名管理 |
| Lambda | Vercel Serverless Functions | 后端代码执行 |
| RDS / Aurora | Supabase PostgreSQL | 托管数据库 |
| CloudFormation | `vercel.json` (可选) | 部署配置 |
| S3 + CloudFront | Vercel Edge Network | 静态资源托管 |

---

## 🚀 Vercel 详解

### 什么是 Vercel？

Vercel 是一个**前端云平台**，但它也能运行后端代码。
可以理解为：**API Gateway + Lambda + S3 + CloudFront 的整合版**。

### Vercel vs AWS Lambda

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS 方式                              │
├─────────────────────────────────────────────────────────────┤
│  1. 写 Lambda 函数                                          │
│  2. 配置 API Gateway 路由                                    │
│  3. 配置 IAM 权限                                           │
│  4. 部署 (sam deploy / serverless deploy)                   │
│  5. 配置域名、证书                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Vercel 方式                            │
├─────────────────────────────────────────────────────────────┤
│  1. 写代码放在 src/app/api/ 目录                             │
│  2. 运行 vercel --prod                                       │
│  └─> 自动完成：路由、HTTPS、域名、CDN                         │
└─────────────────────────────────────────────────────────────┘
```

### 核心概念

#### 1. API Routes = Lambda + API Gateway

```typescript
// src/app/api/users/route.ts
// 这个文件会自动变成 GET /api/users 和 POST /api/users

export async function GET() {
    // 等同于 Lambda handler
    return Response.json({ users: [...] });
}

export async function POST(request: Request) {
    const body = await request.json();
    // 处理逻辑
    return Response.json({ success: true });
}
```

#### 2. 零配置部署

```bash
# AWS 方式 (需要 SAM/Serverless 配置文件)
sam build && sam deploy --guided

# Vercel 方式 (无需配置)
vercel --prod
```

#### 3. 自动伸缩

和 Lambda 一样，Vercel Functions 也是按需运行、自动伸缩。
区别是：Vercel 的冷启动更快（因为针对 JavaScript/Node.js 优化）。

---

## 🗄️ Supabase 详解

### 什么是 Supabase？

Supabase 是一个**开源 Firebase 替代品**，核心是一个托管的 PostgreSQL 数据库。
可以理解为：**RDS/Aurora + Cognito + S3 的整合版**。

### Supabase vs AWS RDS

| 特性 | AWS RDS | Supabase |
|------|---------|----------|
| 数据库 | 自选 (MySQL, PostgreSQL...) | PostgreSQL |
| 连接方式 | VPC 内网 / 公网 | 公网 (Pooler) |
| 认证 | 需配合 Cognito | 内置 Auth |
| 存储 | 需配合 S3 | 内置 Storage |
| 实时 | 需自己实现 | 内置 Realtime |
| 价格 | 按实例计费 | 免费额度 + 按用量 |

### 连接模式详解

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase 连接架构                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   你的应用 ──────────┬──────────> PostgreSQL 数据库         │
│                      │                                      │
│                      ▼                                      │
│            ┌─────────────────┐                              │
│            │  Connection     │                              │
│            │  Pooler         │                              │
│            │  (PgBouncer)    │                              │
│            └─────────────────┘                              │
│                                                             │
│   直连 (5432):    仅 IPv6，适合传统服务器                    │
│   Pooler (6543):  IPv4+IPv6，适合 Serverless ⭐             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 为什么 Serverless 需要连接池？

```python
# ❌ 传统服务器模式 (如 EC2 上的 Flask)
# 服务器启动时建立连接，保持复用
conn = psycopg2.connect(...)  # 启动时连接一次
app.run()  # 连接一直保持

# ❌ Serverless 模式的问题
# 每次请求都可能是新的实例
def lambda_handler(event, context):
    conn = psycopg2.connect(...)  # 每次都创建新连接！
    # 高并发时会耗尽数据库连接数
```

**解决方案：连接池 (Pooler)**

```
请求1 ─┐
请求2 ─┼──> Pooler (管理连接) ──> 数据库
请求3 ─┘    (复用少量连接)
```

---

## 🔗 Vercel + Supabase 集成

### 数据流

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  浏览器   │ ───> │  Vercel  │ ───> │ Supabase │
│  (前端)   │ <─── │  (后端)  │ <─── │  (数据库) │
└──────────┘      └──────────┘      └──────────┘
     │                 │                  │
     │    HTTP         │     SQL          │
     │    请求         │     查询         │
```

### 连接字符串格式

```
postgresql://用户名.项目ID:密码@区域.pooler.supabase.com:6543/postgres?pgbouncer=true
            └─────────────┘ └──┘ └─────────────────────────────┘ └──┘ └──────────────┘
                 用户        密码          主机 (Pooler)          端口    启用连接池
```

---

## 💰 定价对比

| 服务 | 免费额度 | 付费起步 |
|------|----------|----------|
| Vercel | 100GB 带宽/月, 无限部署 | $20/月 |
| Supabase | 500MB 数据库, 1GB 带宽 | $25/月 |
| AWS Lambda | 100万请求 + 40万GB-秒/月 | 按量付费 |
| AWS RDS | 无 (需付费) | ~$15/月起 |

---

## 🤔 何时选择 Vercel/Supabase vs AWS？

| 场景 | 推荐 |
|------|------|
| 快速原型/MVP | Vercel + Supabase ✅ |
| 个人项目/小团队 | Vercel + Supabase ✅ |
| 企业级复杂架构 | AWS |
| 需要精细控制 | AWS |
| 已有 AWS 基础设施 | AWS |

---

## 📚 进一步学习

- [Vercel 官方文档](https://vercel.com/docs)
- [Supabase 官方文档](https://supabase.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)
