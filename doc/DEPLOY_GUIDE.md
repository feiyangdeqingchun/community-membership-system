# 代码修改后的部署流程

## 🚀 快速部署（推荐）

修改代码后，只需在终端运行：

```bash
cd /Users/Junli/Desktop/project/p4-project/web-coding
vercel --prod
```

等待约 1 分钟，部署完成后会显示：
```
✅ Production: https://anti-community-membership-system.vercel.app
```

---

## 📋 完整流程

### 1. 本地测试（可选但推荐）

```bash
# 启动本地开发服务器
npm run dev

# 在浏览器访问 http://localhost:3000 测试
```

### 2. 本地构建验证

```bash
npm run build
```

如果构建成功（无红色错误），继续下一步。

### 3. 部署到 Vercel

```bash
vercel --prod
```

---

## ⚠️ 常见问题

| 问题 | 解决方案 |
|------|----------|
| 构建失败 (TypeScript 错误) | 先在本地 `npm run build` 修复错误 |
| 部署后 500 错误 | 检查 Vercel Logs 查看详细错误 |
| 数据库连接失败 | 确认环境变量 `DATABASE_URL` 配置正确 |

---

## 🔧 环境变量管理

```bash
# 查看当前环境变量
vercel env ls

# 添加新环境变量
vercel env add VARIABLE_NAME production

# 删除环境变量
vercel env rm VARIABLE_NAME production -y
```

---

## 📝 备注

- 每次 `vercel --prod` 都会创建新的部署
- 旧部署会自动保留，可在 Vercel Dashboard 回滚
- 如需强制清除缓存：`vercel --prod --force`
