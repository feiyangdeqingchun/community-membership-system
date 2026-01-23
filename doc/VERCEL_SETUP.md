# Vercel 部署配置步骤

## ✅ 已完成
- [x] 代码已推送到 GitHub: `https://github.com/feiyangdeqingchun/community-membership-system`

## 🚀 接下来的步骤

### 1. 在 Vercel 导入项目
1. 访问 https://vercel.com/new
2. 选择 **Import Git Repository**
3. 找到并选择 `feiyangdeqingchun/community-membership-system`
4. 点击 **Import**

### 2. 配置项目设置
保持默认设置：
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. 设置环境变量 ⚠️ **最关键的一步**

点击 **Environment Variables** 展开，添加：

**变量名**: `DATABASE_URL`

**变量值**: 从 Supabase 获取（步骤如下）

#### 如何获取 Supabase 连接字符串：
1. 打开 Supabase 控制台
2. 进入您的项目
3. 左侧菜单：**Settings** → **Database**
4. 找到 **Connection string** → 选择 **URI** 模式
5. 复制连接字符串（格式类似）：
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
6. **重要**：将 `[YOUR-PASSWORD]` 替换为您的实际数据库密码

### 4. 部署
点击 **Deploy** 按钮，等待 2-3 分钟。

### 5. 初始化数据库
部署成功后，在 Supabase SQL Editor 中运行以下 SQL：

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

### 6. 测试部署
访问 Vercel 提供的 URL（如 `https://community-membership-system.vercel.app`）

测试登录：
- 管理员：`admin` / `admin`
- 普通用户：`testuser` / `123`

---

## 🎯 完成！
您的应用已成功部署到线上！
