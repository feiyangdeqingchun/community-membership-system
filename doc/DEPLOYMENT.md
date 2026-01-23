# Vercel 部署指南

## 前置准备 ✅

- [x] Supabase 账号（已有）
- [x] Vercel 账号（已有）
- [x] 代码已推送到 GitHub

---

## 步骤 1：获取 Supabase 数据库连接字符串

### 1.1 在 Supabase 控制台
1. 进入您的项目（从截图看是 `feiyangdeqingchun's Project`）
2. 点击左侧菜单 **Settings** → **Database**
3. 找到 **Connection string** 部分
4. 选择 **URI** 模式
5. 复制连接字符串，格式类似：
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

> **重要**：将 `[password]` 替换为您的数据库密码

### 1.2 测试连接（可选）
在本地终端运行：
```bash
cd /Users/Junli/Desktop/project/p4-project/web-coding
```

临时修改 `.env` 文件，将 `DATABASE_URL` 改为 Supabase 连接字符串，然后运行：
```bash
npx prisma db push
npx prisma db seed
```

如果成功，说明连接正常。

---

## 步骤 2：推送代码到 GitHub

### 2.1 初始化 Git（如果还没有）
```bash
cd /Users/Junli/Desktop/project/p4-project/web-coding
git init
git add .
git commit -m "feat: 完成会员管理系统 MVP"
```

### 2.2 创建 GitHub 仓库并推送
1. 在 GitHub 创建新仓库（如 `community-membership-app`）
2. 推送代码：
```bash
git remote add origin https://github.com/YOUR_USERNAME/community-membership-app.git
git branch -M main
git push -u origin main
```

---

## 步骤 3：在 Vercel 部署

### 3.1 导入项目
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 选择您刚推送的 GitHub 仓库
4. 点击 **Import**

### 3.2 配置项目
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）

### 3.3 设置环境变量 ⚠️ **关键步骤**
在 **Environment Variables** 部分添加：

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres.[project-ref]:[password]@...` |

> 粘贴您从 Supabase 复制的完整连接字符串

### 3.4 部署
点击 **Deploy** 按钮，等待 2-3 分钟。

---

## 步骤 4：初始化生产数据库

部署成功后，需要在 Supabase 数据库中创建表和测试数据。

### 方法 A：使用 Vercel CLI（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 运行 Prisma 命令
vercel env pull .env.production
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-) npx prisma db push
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-) npx prisma db seed
```

### 方法 B：直接在 Supabase SQL Editor
1. 在 Supabase 控制台，进入 **SQL Editor**
2. 运行以下 SQL：

```sql
-- 创建 User 表
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  is_member BOOLEAN DEFAULT true,
  join_date TIMESTAMP DEFAULT NOW(),
  level TEXT DEFAULT '普通',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 创建 Merchant 表
CREATE TABLE "Merchant" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- 插入测试数据
INSERT INTO "User" (id, name, username, password, points, is_member, level)
VALUES 
  ('admin', '管理员', 'admin', 'admin', 0, false, '普通'),
  ('testuser1', '测试用户', 'testuser', '123', 100, true, '普通会员');

INSERT INTO "Merchant" (id, name)
VALUES 
  ('ktv001', '星光 KTV'),
  ('coffee002', '街角咖啡');
```

---

## 步骤 5：验证部署

1. 访问 Vercel 提供的 URL（如 `https://your-app.vercel.app`）
2. 测试登录：
   - 管理员：`admin` / `admin`
   - 普通用户：`testuser` / `123`
3. 检查功能是否正常

---

## 常见问题

### Q: 部署后出现 500 错误
**A**: 检查 Vercel 的 **Functions** 日志，通常是数据库连接问题。确认 `DATABASE_URL` 环境变量正确。

### Q: Prisma 找不到表
**A**: 确保已运行 `prisma db push` 或在 Supabase 中手动创建表。

### Q: 如何更新代码？
**A**: 推送到 GitHub 的 `main` 分支，Vercel 会自动重新部署。

---

## 下一步优化（可选）

- [ ] 配置自定义域名
- [ ] 启用 Vercel Analytics
- [ ] 添加错误监控（如 Sentry）
- [ ] 优化 SEO 元数据
